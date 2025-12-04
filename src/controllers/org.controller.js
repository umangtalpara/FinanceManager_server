const orgService = require('../services/org.service');

exports.createOrg = async (req, res) => {
    try {
        const { name, currency } = req.body;
        const userId = req.user.id;
        const organization = await orgService.createOrg(name, currency, userId);
        res.json(organization);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getOrgs = async (req, res) => {
    try {
        const userId = req.user.id;
        const orgs = await orgService.getOrgs(userId);
        res.json(orgs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getOrgById = async (req, res) => {
    try {
        const org = await orgService.getOrgById(req.params.id);
        res.json(org);
    } catch (err) {
        console.error(err.message);
        if (err.message === 'Organization not found') {
            return res.status(404).json({ message: err.message });
        }
        res.status(500).send('Server error');
    }
};

exports.getOrgMembers = async (req, res) => {
    try {
        const members = await orgService.getOrgMembers(req.params.id);
        res.json(members);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.addMember = async (req, res) => {
    try {
        const { email, role, fullName, password } = req.body;
        const member = await orgService.addMember(req.params.id, email, role, fullName, password);
        res.json(member);
    } catch (err) {
        console.error(err.message);
        if (err.message.includes('User not found') || err.message === 'User is already a member of this organization') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).send('Server error');
    }
};

exports.removeMember = async (req, res) => {
    try {
        const result = await orgService.removeMember(req.params.id, req.params.memberId);
        res.json(result);
    } catch (err) {
        console.error(err.message);
        if (err.message === 'Member not found') {
            return res.status(404).json({ message: err.message });
        }
        res.status(500).send('Server error');
    }
};
