const express = require('express')
const router = express.Router()
const {createStudent,getAllStd} = require('../controller/student.controller')

router.post('/add', createStudent);
router.get('/get',getAllStd);


module.exports = router