const { addStudent , getStd, addRequest,getLoanRequest} = require('../service/student.service');

const createStudent = async (req, res, next) => {
    try {

        const data = req.body

        const student = await addStudent(data)

        res.status(201).json({student})

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
    const { page = 1, limit = 10, search = '' } = req.query
    const result = await getLoanRequest({ page, limit, search });
    res.status(200).json(result);
  } catch (err) {
    next(err)
  }
}

module.exports = {
    createStudent,
    getAllStd,
    addRequestController,
    getAllReq
}