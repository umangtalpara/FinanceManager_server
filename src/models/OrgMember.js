const mongoose = require('mongoose');

const orgMemberSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Lead', 'Employee'],
        default: 'Employee'
    },
    status: {
        type: String,
        enum: ['Invited', 'Active', 'Inactive'],
        default: 'Invited'
    },
    joinedAt: {
        type: Date
    }
});

// Ensure a user is only a member of an org once
orgMemberSchema.index({ userId: 1, orgId: 1 }, { unique: true });

module.exports = mongoose.model('OrgMember', orgMemberSchema);
