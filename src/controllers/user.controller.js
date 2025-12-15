const userService = require('../services/user.service');

exports.adminChangePassword = async (req, res) => {
    try {
        const { userId, newPassword, orgId } = req.body;
        const adminId = req.user.id;

        if (!orgId) return res.status(400).json({ message: 'Org ID required' });

        const result = await userService.adminChangePassword(adminId, userId, orgId, newPassword);
        res.json(result);

    } catch (err) {
        console.error(err.message);
        if (err.message === 'Not authorized to change passwords') {
            return res.status(403).json({ message: err.message });
        }
        if (err.message === 'User not found in this organization' || err.message === 'User not found') {
            return res.status(404).json({ message: err.message });
        }
        res.status(500).send('Server error');
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const userId = req.user.id;

        const result = await userService.updateProfile(userId, { fullName, email, password });
        res.json(result);
    } catch (err) {
        console.error(err.message);
        if (err.message === 'User not found') {
            return res.status(404).json({ message: err.message });
        }
        res.status(500).send('Server error');
    }
};
