const Transaction = require('../models/Transaction');
const Project = require('../models/Project');
const OrgMember = require('../models/OrgMember');
const AuditLog = require('../models/AuditLog');

exports.createTransaction = async (transactionData, userId) => {
    const { type, amount, taxAmount, projectId, description, date, categoryId, isRecurring, recurringFrequency } = transactionData;

    const project = await Project.findById(projectId);
    if (!project) {
        throw new Error('Project not found');
    }

    const member = await OrgMember.findOne({ userId, orgId: project.orgId });
    if (!member) {
        throw new Error('Not a member of this organization');
    }

    const transaction = new Transaction({
        type,
        amount,
        taxAmount: taxAmount || 0,
        projectId,
        orgId: project.orgId,
        createdByMemberId: member._id,
        description,
        date: date || Date.now(),
        status: type === 'Expectation' ? 'Pending' : 'Approved',
        categoryId,
        isRecurring,
        recurringFrequency
    });

    if (type === 'Debit' || type === 'Expectation') {
        project.currentSpend += Number(amount);
        await project.save();
    }

    await transaction.save();

    // Audit Log
    await new AuditLog({
        action: 'CREATE_TRANSACTION',
        entityType: 'Transaction',
        entityId: transaction._id,
        performedBy: userId,
        orgId: project.orgId,
        details: { amount, type, projectId }
    }).save();

    return transaction;
};

exports.getTransactions = async (projectId) => {
    const transactions = await Transaction.find({ projectId })
        .populate('categoryId', 'name type')
        .populate({
            path: 'createdByMemberId',
            select: 'role userId',
            populate: {
                path: 'userId',
                select: 'fullName email'
            }
        })
        .sort({ date: -1 });
    return transactions;
};

exports.updateTransaction = async (transactionId, updateData, userId) => {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
        throw new Error('Transaction not found');
    }

    const project = await Project.findById(transaction.projectId);
    const member = await OrgMember.findOne({ userId, orgId: project.orgId });
    
    // Only Admin or the creator can update (unless it's approved, then maybe restricted? For now allow edit)
    if (!member || (member.role !== 'Admin' && transaction.createdByMemberId.toString() !== member._id.toString())) {
        throw new Error('Not authorized to update this transaction');
    }

    // Adjust budget if amount changed and it was a Debit/Expectation
    if ((transaction.type === 'Debit' || transaction.type === 'Expectation') && updateData.amount) {
        const diff = Number(updateData.amount) - transaction.amount;
        project.currentSpend += diff;
        await project.save();
    }

    Object.assign(transaction, updateData);
    await transaction.save();

    // Audit Log
    await new AuditLog({
        action: 'UPDATE_TRANSACTION',
        entityType: 'Transaction',
        entityId: transaction._id,
        performedBy: userId,
        orgId: project.orgId,
        details: updateData
    }).save();

    return transaction;
};

exports.settleTransaction = async (transactionId, userId) => {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) throw new Error('Transaction not found');

    if (transaction.status !== 'Approved') {
        throw new Error('Only approved transactions can be settled');
    }

    const project = await Project.findById(transaction.projectId);
    const member = await OrgMember.findOne({ userId, orgId: project.orgId });

    if (!member || member.role !== 'Admin') {
        throw new Error('Only Admins can settle transactions');
    }

    transaction.status = 'Settled';
    transaction.settledAt = Date.now();
    await transaction.save();

    // Audit Log
    await new AuditLog({
        action: 'SETTLE_TRANSACTION',
        entityType: 'Transaction',
        entityId: transaction._id,
        performedBy: userId,
        orgId: project.orgId,
        details: { status: 'Settled' }
    }).save();

    return transaction;
};

exports.deleteTransaction = async (transactionId, userId) => {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
        throw new Error('Transaction not found');
    }

    const project = await Project.findById(transaction.projectId);
    const member = await OrgMember.findOne({ userId, orgId: project.orgId });

    if (!member || (member.role !== 'Admin' && transaction.createdByMemberId.toString() !== member._id.toString())) {
        throw new Error('Not authorized to delete this transaction');
    }

    // Revert budget if it was Debit/Expectation
    if (transaction.type === 'Debit' || transaction.type === 'Expectation') {
        project.currentSpend -= transaction.amount;
        await project.save();
    }

    await Transaction.findByIdAndDelete(transactionId);
    return { message: 'Transaction deleted successfully' };
};
