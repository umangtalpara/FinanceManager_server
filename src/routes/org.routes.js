const express = require('express');
const router = express.Router();
const orgController = require('../controllers/org.controller');
const auth = require('../middleware/auth');

router.post('/', auth, orgController.createOrg);
router.get('/', auth, orgController.getOrgs);
router.get('/:id', auth, orgController.getOrgById);
router.get('/:id/members', auth, orgController.getOrgMembers);
router.post('/:id/members', auth, orgController.addMember);
router.delete('/:id/members/:memberId', auth, orgController.removeMember);
router.put('/:id/members/:memberId', auth, orgController.updateMember);

module.exports = router;
