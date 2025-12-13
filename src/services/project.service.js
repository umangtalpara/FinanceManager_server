const Project = require('../models/Project');
const OrgMember = require('../models/OrgMember');

exports.createProject = async (projectData) => {
    const { name, orgId, totalBudget, approvalRequired, projectLeadId, assignedMembers } = projectData;
    
    const project = new Project({
        name,
        orgId,
        totalBudget,
        approvalRequired,
        projectLeadId,
        assignedMembers: assignedMembers || []
    });
    await project.save();
    return project;
};

exports.getProjects = async (orgId, userId) => {
    // Find the member profile for this user in this org
    const member = await OrgMember.findOne({ userId, orgId });
    if (!member) {
        throw new Error('Not a member of this organization');
    }

    let query = { orgId };

    // If Admin, return all projects
    if (member.role === 'Admin') {
        return await Project.find(query).populate('projectLeadId').populate('assignedMembers');
    }

    // If Lead or Employee, return projects where they are Lead OR Assigned
    query.$or = [
        { projectLeadId: member._id },
        { assignedMembers: member._id }
    ];

    return await Project.find(query).populate('projectLeadId').populate('assignedMembers');
};

exports.getProjectById = async (projectId) => {
    const project = await Project.findById(projectId).populate('projectLeadId').populate('assignedMembers');
    return project;
};

exports.assignMembers = async (projectId, { projectLeadId, assignedMembers }) => {
    const project = await Project.findById(projectId);
    if (!project) throw new Error('Project not found');

    if (projectLeadId) project.projectLeadId = projectLeadId;
    if (assignedMembers) project.assignedMembers = assignedMembers;

    await project.save();
    return project;
};

exports.updateProject = async (projectId, updates) => {
    const project = await Project.findById(projectId);
    if (!project) throw new Error('Project not found');

    const allowedUpdates = ['name', 'totalBudget', 'approvalRequired', 'projectLeadId'];
    allowedUpdates.forEach(update => {
        if (updates[update] !== undefined) {
            project[update] = updates[update];
        }
    });

    await project.save();
    return project;
};
