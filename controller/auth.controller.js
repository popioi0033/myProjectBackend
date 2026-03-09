const  { login } = require ('../service/auth.service');
const jwt = require('jsonwebtoken')

const loginController = async (req,res,next)=>{
    try{

        const { username, password } = req.body

        const user = await login(username, password)

        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role,
                officerCode: user.officerCode
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        res.json({
            message: "login success",
            token,
            user
        })

    }catch(err){
        next(err)
    }
}

module.exports = {
    loginController
}