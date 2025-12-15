const User = require('../models/User');
const OrgMember = require('../models/OrgMember');
const Organization = require('../models/Organization');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const emailService = require('./email.service');

exports.register = async (userData) => {
    const { fullName, email, password, orgName } = userData;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
        throw new Error('User already exists');
    }

    // Create User
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    user = new User({
        fullName,
        email,
        passwordHash
    });
    await user.save();

    // Create Organization
    const organization = new Organization({
        name: orgName || `${fullName}'s Organization`,
        currency: 'USD'
    });
    await organization.save();

    // Create OrgMember (Admin)
    const orgMember = new OrgMember({
        userId: user._id,
        orgId: organization._id,
        role: 'Admin',
        status: 'Active',
        joinedAt: new Date()
    });
    await orgMember.save();

    // Generate Token
    const payload = {
        user: {
            id: user._id
        }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    return { token, user: { id: user._id, fullName, email }, org: { id: organization._id, name: organization.name } };
};

exports.login = async (email, password) => {
    // Check User
    let user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid Credentials');
    }

    // Check Password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error('Invalid Credentials');
    }

    // Return Token
    const payload = {
        user: {
            id: user._id
        }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    return { token, user: { id: user._id, fullName: user.fullName, email } };
};

exports.forgotPassword = async (email) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('User not found');
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send Email
    await emailService.sendEmail(
        user.email,
        'Password Reset OTP',
        `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`
    );

    return { message: 'OTP sent to email' };
};

exports.resetPassword = async (email, otp, newPassword) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('User not found');
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
        throw new Error('Invalid or expired OTP');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    
    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return { message: 'Password reset successful' };
};

exports.getMe = async (userId) => {
    const user = await User.findById(userId).select('-passwordHash -otp -otpExpires');
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};
