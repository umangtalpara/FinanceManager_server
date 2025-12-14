const Transaction = require('../models/Transaction');
const Project = require('../models/Project');
const OrgMember = require('../models/OrgMember');

exports.updateStatus = async (transactionId, status, userId) => {
    const transaction = await Transaction.findById(transactionId).populate('projectId');
    if (!transaction) {
        throw new Error('Transaction not found');
    }

    // Verify user permissions (Lead, Admin, or Project Lead)
    const member = await OrgMember.findOne({ userId, orgId: transaction.projectId.orgId });
    
    const isProjectLead = transaction.projectId.projectLeadId && member && transaction.projectId.projectLeadId.toString() === member._id.toString();

    if (!member || (member.role !== 'Admin' && member.role !== 'Lead' && !isProjectLead)) {
        throw new Error('Not authorized to approve/settle');
    }

    if (status === 'Rejected' && transaction.status !== 'Rejected') {
        // Revert budget usage
        if (transaction.type === 'Debit' || transaction.type === 'Expectation') {
            const project = await Project.findById(transaction.projectId._id);
            project.currentSpend -= transaction.amount;
            await project.save();
        }
    }

    transaction.status = status;
    await transaction.save();

    return transaction;
};
