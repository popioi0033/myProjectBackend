// modules/officer/officer.controller.js
const { createOfficer , getOfficers} = require('../service/officer.service')

const create = async (req, res, next) => {
  try {
    const officer = await createOfficer(req.body)
    res.status(201).json(officer)
  } catch (err) {
    next(err)
  }
}

const getAllOfficers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query
    const result = await getOfficers({ page, limit, search });
    res.status(200).json(result);
  } catch (err) {
    next(err)
  }
}
module.exports = {
  create,
  getAllOfficers
}
