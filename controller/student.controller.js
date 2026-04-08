const { addStudent , getStd, addRequest,getLoanRequest,updateStatus,getExportData,updateStd,getExportStudentData} = require('../service/student.service');
const ExcelJS = require('exceljs')

const createStudent = async (req, res, next) => {
    try {

        const data = req.body

        const result = await addStudent(data)

        res.status(201).json({result})

    } catch (error) {
        next(error)
    }
}

const getAllStd = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query
    const result = await getStd({ page, limit, search });
    res.status(200).json(result);
  } catch (err) {
    next(err)
  }
}

const addRequestController = async (req, res, next) => {
    try {
        const { studentId, academicYear, semester } = req.body
        const officerId = req.user.userId 

        const result = await addRequest({ studentId, academicYear, semester, officerId })
        res.status(201).json({ result })
    } catch (err) {
        next(err)
    }
}

const getAllReq = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' , status = '' } = req.query
    const result = await getLoanRequest({ page, limit, search,status });
    res.status(200).json(result);
  } catch (err) {
    next(err)
  }
}

const updateStatusController = async (req, res, next) => {
    try {
        const { requestId, action } = req.body  
        const officerId = req.user.userId

        const result = await updateStatus(requestId, officerId, action)
        res.status(200).json({ result })
    } catch (err) {
        next(err)
    }
}
const exportController = async (req, res, next) => {
    try {
        const { search = '', status = '' } = req.query
        const result = await getExportData({ search, status })

        const workbook = new ExcelJS.Workbook()
        const sheet = workbook.addWorksheet('Loan Requests')

        sheet.columns = [
            { header: 'Student ID',    key: 'student_code',  width: 15 },
            { header: 'First Name',    key: 'first_name',    width: 15 },
            { header: 'Last Name',     key: 'last_name',     width: 15 },
            { header: 'Email',         key: 'email',         width: 25 },
            { header: 'Phone',         key: 'phone',         width: 15 },
            { header: 'Faculty',       key: 'faculty_name',  width: 25 },
            { header: 'Branch',        key: 'branch',        width: 20 },
            { header: 'Year',          key: 'year',          width: 8  },
            { header: 'GPAX',          key: 'gpax',          width: 8  },
            { header: 'Academic Year', key: 'academic_year', width: 15 },
            { header: 'Semester',      key: 'semester',      width: 10 },
            { header: 'Officer',       key: 'officer_name',  width: 20 },
            { header: 'Status',        key: 'status',        width: 20 },
        ]

        sheet.getRow(1).font = { bold: true }
        sheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF8C00' }
        }

        result.forEach(row => sheet.addRow(row))

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', 'attachment; filename=loan_requests.xlsx')

        await workbook.xlsx.write(res)
        res.end()

    } catch (err) {
        next(err)
    }
}

const updateStdController = async (req, res, next) => {
    try {
        const { id } = req.params
        const data = req.body

        const result = await updateStd(id, data)
        res.status(200).json({ result })
    } catch (err) {
        next(err)
    }
}

const exportStudentController = async (req, res, next) => {
    try {
        const { search = '' } = req.query
        const data = await getExportStudentData({ search })

        const workbook = new ExcelJS.Workbook()
        const sheet = workbook.addWorksheet('Students')

        sheet.columns = [
            { header: 'Student ID',  key: 'student_code',  width: 15 },
            { header: 'First Name',  key: 'first_name',    width: 15 },
            { header: 'Last Name',   key: 'last_name',     width: 15 },
            { header: 'Email',       key: 'email',         width: 25 },
            { header: 'Phone',       key: 'phone',         width: 15 },
            { header: 'Faculty',     key: 'faculty_name',  width: 25 },
            { header: 'Branch',      key: 'branch',        width: 20 },
            { header: 'Year',        key: 'year',          width: 8  },
            { header: 'GPAX',        key: 'gpax',          width: 8  },
        ]

        sheet.getRow(1).font = { bold: true }
        sheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF8C00' }
        }

        data.forEach(row => sheet.addRow(row))

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx')

        await workbook.xlsx.write(res)
        res.end()

    } catch (err) {
        next(err)
    }
}

module.exports = {
    createStudent,
    getAllStd,
    addRequestController,
    getAllReq,
    updateStatusController,
    exportController,
    updateStdController,
    exportStudentController 
}