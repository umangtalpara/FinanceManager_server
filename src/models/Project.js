const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    totalBudget: {
        type: Number,
        default: 0
    },
    currentSpend: {
        type: Number,
        default: 0
    },
    approvalRequired: {
        type: Boolean,
        default: true
    },
    projectLeadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrgMember'
    },
    assignedMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrgMember'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', projectSchema);
