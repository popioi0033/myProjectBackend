// modules/officer/officer.route.js
const express = require('express')
const router = express.Router()
const { create, getAllOfficers , exportofficerController} = require('../controller/officer.controller');
const authMiddlewere = require('../middleware/auth.middleware');

router.post('/', create)
router.get('/get',getAllOfficers)
router.get('/export', exportofficerController);

module.exports = router
