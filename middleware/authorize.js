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
            throw new AppError('You are not logged in, please login to continue', 400)
        }

        // save token from authHeader if available
        token = authHeader.split(' ')[1];
    }else if(process.env.NODE_ENV === 'production') {
        const cookieValue = req.cookies.jwt;
        if (!cookieValue){
            throw new AppError('You are not logged in, please login to continue')
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
        throw new AppError('Account not found. Please login again', 404)
    }

    // add user to req object
    req.user = currentUser;

    next()
}