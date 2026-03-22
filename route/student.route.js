const express = require('express')
const router = express.Router()
const {createStudent,getAllStd,addRequestController,getAllReq,updateStatusController,exportController,updateStdController,exportStudentController} = require('../controller/student.controller')
const authMiddleware = require('../middleware/auth.middleware') 

router.post('/add', createStudent);
router.get('/get',getAllStd);
router.post('/add-request',authMiddleware,addRequestController);
router.get('/get-request',getAllReq);
router.put('/update-status',authMiddleware,updateStatusController);
router.get('/export-request',exportController);
router.put('/update-student/:id',updateStdController)
router.get('/export-student',exportStudentController)



module.exports = router