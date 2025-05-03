const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const {logout} = require("../controllers/authController");
const protectRoute =async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token){

            return res.status(401).json({error:'No token provided'})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded){
            return res.status(401).json({error:'Invalid token'})
        }

        const user = await User.findById(decoded.userId)

        if (!user){
            return  res.status(400).json({error: 'User not found'});
        }

        req.user = user;

        next();

    }catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.clearCookie('jwt', {
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV !== 'development',
            });
            return res.status(401).json({ error: 'expired' });
        }
        else {
            console.log(error)
            return res.status(500).json({error: error.message});
        }
    }
}

module.exports = protectRoute