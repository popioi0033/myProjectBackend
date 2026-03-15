const  { login } = require ('../service/auth.service');
const jwt = require('jsonwebtoken')

const loginController = async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await login(username, password)

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" })
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role, officerCode: user.officerCode },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        res.cookie("token", token, {
            httpOnly: true,   // JS อ่านไม่ได้
            secure: false,    // true ถ้าใช้ https
            sameSite: "lax",
            maxAge: 60 * 60 * 1000  // 1 ชั่วโมง
        })

        res.json({ message: "login success", user })

    } catch (err) {
        next(err)
    }
}

module.exports = {
    loginController
}