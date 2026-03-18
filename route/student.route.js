const express = require('express')
const router = express.Router()
const {createStudent,getAllStd,addRequestController,getAllReq,updateStatusController,exportController} = require('../controller/student.controller')
const authMiddleware = require('../middleware/auth.middleware') 

router.post('/add', createStudent);
router.get('/get',getAllStd);
router.post('/add-request',authMiddleware,addRequestController);
router.get('/get-request',getAllReq);
router.put('/update-status',authMiddleware,updateStatusController);
router.get('/export-request',exportController);



module.exports = router