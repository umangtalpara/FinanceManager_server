const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Credit', 'Debit', 'Expectation'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    taxAmount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Settled'],
        default: 'Pending'
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringFrequency: {
        type: String,
        enum: ['Weekly', 'Monthly', 'Yearly', null],
        default: null
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    createdByMemberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrgMember',
        required: true
    },
    description: {
        type: String
    },
    rejectionReason: {
        type: String
    },
    settledAt: {
        type: Date
    },
    attachmentUrl: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);
