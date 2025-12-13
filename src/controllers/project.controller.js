const projectService = require('../services/project.service');

exports.createProject = async (req, res) => {
    try {
        const project = await projectService.createProject(req.body);
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getProjects = async (req, res) => {
    try {
        const { orgId } = req.query;
        if (!orgId) return res.status(400).json({ message: 'Org ID required' });

        const userId = req.user.id;
        const projects = await projectService.getProjects(orgId, userId);
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        if (err.message === 'Not a member of this organization') {
            return res.status(403).json({ message: err.message });
        }
        res.status(500).send('Server error');
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await projectService.getProjectById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.assignMembers = async (req, res) => {
    try {
        const project = await projectService.assignMembers(req.params.id, req.body);
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateProject = async (req, res) => {
    try {
        const project = await projectService.updateProject(req.params.id, req.body);
        res.json(project);
    } catch (err) {
        console.error(err.message);
        if (err.message === 'Project not found') {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(500).send('Server error');
    }
};
