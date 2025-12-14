const Organization = require('../models/Organization');
const OrgMember = require('../models/OrgMember');

exports.createOrg = async (name, currency, userId) => {
    const organization = new Organization({
        name,
        currency
    });
    await organization.save();

    const orgMember = new OrgMember({
        userId,
        orgId: organization._id,
        role: 'Admin',
        status: 'Active',
        joinedAt: new Date()
    });
    await orgMember.save();

    return organization;
};

exports.getOrgs = async (userId) => {
    const members = await OrgMember.find({ userId }).populate('orgId');
    return members.map(member => ({
        ...member.orgId.toObject(),
        currentUserRole: member.role
    }));
};

exports.getOrgById = async (orgId) => {
    const org = await Organization.findById(orgId);
    if (!org) {
        throw new Error('Organization not found');
    }
    return org;
};

exports.getOrgMembers = async (orgId) => {
    const members = await OrgMember.find({ orgId }).populate('userId', 'fullName email');
    return members;
};

exports.addMember = async (orgId, email, role, fullName, password) => {
    const User = require('../models/User');
    const bcrypt = require('bcryptjs');

    let user = await User.findOne({ email });
    
    // If user doesn't exist, create them
    if (!user) {
        if (!password || !fullName) {
            throw new Error('User not found. Please provide name and password to create a new account.');
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        user = new User({
            fullName,
            email,
            passwordHash
        });
        await user.save();
    }

    const existingMember = await OrgMember.findOne({ userId: user._id, orgId });
    if (existingMember) {
        throw new Error('User is already a member of this organization');
    }

    const newMember = new OrgMember({
        userId: user._id,
        orgId,
        role: role || 'Employee',
        status: 'Active',
        joinedAt: new Date()
    });

    await newMember.save();
    return newMember;
};

exports.removeMember = async (orgId, memberId) => {
    const member = await OrgMember.findOne({ _id: memberId, orgId });
    if (!member) {
        throw new Error('Member not found');
    }
    
    // Prevent removing the last Admin? (Optional check)
    
    await OrgMember.findByIdAndDelete(memberId);
    return { message: 'Member removed successfully' };
};
