const { facultyDropdown } = require('../service/faculty.service');

const getFacultyDropdown = async (req, res, next) => {
    try {

        const search = req.query.search || ''

        const faculties = await facultyDropdown(search)

        res.status(200).json({
            success: true,
            data: faculties
        })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    getFacultyDropdown
}