const Transaction = require('../models/Transaction');
const Project = require('../models/Project');

exports.getProjectPnL = async (projectId) => {
    const transactions = await Transaction.find({ projectId, status: { $in: ['Approved', 'Settled'] } });
    
    let totalCredits = 0;
    let totalDebits = 0;
    
    transactions.forEach(t => {
        if (t.type === 'Credit') totalCredits += t.amount;
        if (t.type === 'Debit') totalDebits += t.amount;
    });
    
    const pnl = totalCredits - totalDebits;
    
    return {
        projectId,
        totalCredits,
        totalDebits,
        pnl
    };
};

exports.getOrgStats = async (orgId) => {
    // Get all projects for the org
    const projects = await Project.find({ orgId });
    const projectIds = projects.map(p => p._id);

    const transactions = await Transaction.find({ 
        projectId: { $in: projectIds },
        status: { $in: ['Approved', 'Settled'] }
    });

    let totalIncome = 0;
    let totalExpenses = 0;
    let pendingApprovals = await Transaction.countDocuments({ 
        projectId: { $in: projectIds },
        status: 'Pending'
    });

    transactions.forEach(t => {
        if (t.type === 'Credit') totalIncome += t.amount;
        if (t.type === 'Debit') totalExpenses += t.amount;
    });

    return {
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses,
        pendingApprovals
    };
};
