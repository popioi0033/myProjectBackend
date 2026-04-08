// modules/officer/officer.controller.js
const { createOfficer, getOfficers, exportOfficer } = require('../service/officer.service')
const ExcelJS = require('exceljs')

const create = async (req, res, next) => {
  try {
    const data = req.body
    const result = await createOfficer(data)
    res.status(201).json(result)
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

const exportofficerController = async (req, res, next) => {
  try {
    const { search = '' } = req.query
    const result = await exportOfficer({ search });

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet('Officers');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Officer Code', key: 'officer_code', width: 20 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Institute', key: 'institute', width: 30 },
      { header: 'Job Position', key: 'job_position', width: 20 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Role', key: 'role', width: 15 }
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF8C00' }
    };
    
    result.forEach(row => worksheet.addRow(row))

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename=officer-report.xlsx')

    await workbook.xlsx.write(res)
    res.end()
  } catch (err) {
    next(err)
  }
}
module.exports = {
  create,
  getAllOfficers,
  exportofficerController
}
