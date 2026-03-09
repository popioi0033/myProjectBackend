const pool = require('../db')

const facultyDropdown = async (search) => {
    try {

        const result = await pool.query(
            `
            SELECT code, name
            FROM faculties
            WHERE is_active = true
            AND name ILIKE $1
            ORDER BY name
            LIMIT 10
            `,
            [`%${search}%`]
        )

        return result.rows

    } catch (error) {
        throw error
    }
}

module.exports = {
    facultyDropdown
}