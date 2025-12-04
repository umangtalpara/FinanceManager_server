const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const auth = require('../middleware/auth');

router.post('/', auth, projectController.createProject);
router.get('/', auth, projectController.getProjects);
router.get('/:id', auth, projectController.getProjectById);
router.put('/:id/assign', auth, projectController.assignMembers);

module.exports = router;
