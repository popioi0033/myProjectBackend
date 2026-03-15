const express = require('express')
const router = express.Router()
const {createStudent,getAllStd,addRequestController,getAllReq} = require('../controller/student.controller')
const authMiddleware = require('../middleware/auth.middleware') 

router.post('/add', createStudent);
router.get('/get',getAllStd);
router.post('/add-request',authMiddleware,addRequestController);
router.get('/get-request',getAllReq);


module.exports = router