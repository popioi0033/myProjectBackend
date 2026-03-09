const { addStudent } = require('../service/student.service');

const createStudent = async (req, res, next) => {
    try {

        const data = req.body

        const student = await addStudent(data)

        res.status(201).json({student})

    } catch (error) {
        next(error)
    }
}

module.exports = {
    createStudent
}