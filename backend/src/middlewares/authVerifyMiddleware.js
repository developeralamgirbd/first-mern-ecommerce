const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authVerify = async (req, res, next)=>{
    try {
        req.user = jwt.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        next();
    }catch (error) {
        return res.status(401).json({
            status: 'fail',
            error: error.message
        })
    }
}

exports.isAdmin = async (req, res, next)=>{
    try {
        const user = await User.findById(req.user._id);

        if (user.role !== 1){
            return res.status(401).json({
                status: 'fail',
                error: 'Unauthorized'
            })
        }
        next()

    }catch (error) {
        console.log(error)
    }
}