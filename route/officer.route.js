// modules/officer/officer.route.js
const express = require('express')
const router = express.Router()
const { create } = require('../controller/officer.controller')

router.post('/', create)

module.exports = router
