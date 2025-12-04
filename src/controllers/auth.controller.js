const authService = require('../services/auth.service');

exports.register = async (req, res) => {
    try {
        const result = await authService.register(req.body);
        res.json(result);
    } catch (err) {
        console.error(err.message);
        if (err.message === 'User already exists') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json(result);
    } catch (err) {
        console.error(err.message);
        if (err.message === 'Invalid Credentials') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).send('Server error');
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await authService.forgotPassword(email);
        res.json(result);
    } catch (err) {
        console.error(err.message);
        if (err.message === 'User not found') {
            return res.status(404).json({ message: err.message });
        }
        res.status(500).send('Server error');
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const result = await authService.resetPassword(email, otp, newPassword);
        res.json(result);
    } catch (err) {
        console.error(err.message);
        if (err.message === 'User not found') {
            return res.status(404).json({ message: err.message });
        }
        if (err.message === 'Invalid or expired OTP') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).send('Server error');
    }
};
