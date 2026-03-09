const pool = require('../db')
const bcrypt = require('bcrypt')

const login = async (username, password) => {
    try {

        const result = await pool.query(
            `
            SELECT id, officer_code, name, password, role
            FROM officers
            WHERE username = $1
            `,
            [username]
        )

        if(result.rows.length === 0){
            console.log('user not found')
            return null
        }

        const user = result.rows[0]

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            console.log('Invalid Username and Password')
            return null
        }

        console.log("login success", user.name)

        return {
            id: user.id,
            officerCode: user.officer_code,
            name: user.name,
            role: user.role
        }

    }catch(err){
        console.error("login failed",err)
        throw err
    }
}

module.exports = { login }