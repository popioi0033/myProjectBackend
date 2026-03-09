const express = require('express')
const router = express.Router()

const { getFacultyDropdown } = require('../controller/faculty.controller')

router.get('/', getFacultyDropdown)

module.exports = router