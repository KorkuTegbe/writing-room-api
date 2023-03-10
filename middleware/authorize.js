require('express-async-errors');
require('dotenv').config();
const AppError = require('../utils/appError')
const logger = require('../utils/logger')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const db = require('../models')
const User = db.users


exports.authorize = async (req,res,next) => {
    let token;

    if(process.env.NODE_ENV === 'development'){
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({
                status: 'fail',
                message: 'You are not logged in, please login to continue'
            })
        }

        // save token from authHeader if available
        token = authHeader.split(' ')[1];
    }else if(process.env.NODE_ENV === 'production') {
        const cookieValue = req.cookies.jwt;
        if (!cookieValue){
            return res.status(401).json({
                status: 'fail',
                message: 'You are not logged in, please login to continue'
            })
        }

        // save token from cookie
        token = req.cookie.jwt;
    }

    // verify token
    const verifyToken = await promisify(jwt.verify) (
        token,
        process.env.JWT_SECRET
    );

    // check if user exists, we do this because verification was successful
    const currentUser = await User.findOne({
        where: { id: verifyToken.user_id },
    });

    if (!currentUser){
        return res.status(401).json({
            status: 'fail',
            message: 'Account not found. Please login'
        })
    }

    req.user = currentUser;

    next()
}