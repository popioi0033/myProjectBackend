const express = require('express')
const router = express.Router()
const {loginController} = require('../controller/auth.controller')


router.post('/', loginController)

module.exports = router