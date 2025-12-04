const User = require('../models/User');
const OrgMember = require('../models/OrgMember');
const bcrypt = require('bcryptjs');

exports.adminChangePassword = async (adminId, userId, orgId, newPassword) => {
    // Verify Admin
    const adminMember = await OrgMember.findOne({ userId: adminId, orgId, role: 'Admin' });
    if (!adminMember) {
        throw new Error('Not authorized to change passwords');
    }

    const targetMember = await OrgMember.findOne({ userId, orgId });
    if (!targetMember) {
        throw new Error('User not found in this organization');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    return { message: 'Password updated successfully' };
};
