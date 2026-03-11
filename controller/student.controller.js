const { addStudent , getStd} = require('../service/student.service');

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

module.exports = {
    createStudent,
    getAllStd
}