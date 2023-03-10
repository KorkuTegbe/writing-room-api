require('express-async-errors');
const db = require('../models');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');

const User = db.users;



// function that handles token and cookie response
const createSendToken = async (user, statusCode, res, msg) => {
    // create jwt with model instance
    const token = await user.createJwt();
    const cookieOptions = {
        expires: new Date(Date.now() + 1 * 60 * 60 *1000),
        httpOnly: true,
        sameSite: 'None',
    };

    if(process.env.NODE_ENV === 'production'){
        cookieOptions.secure = true;
    }

    // send token to client
    res.cookie('jwt', token, cookieOptions)

    user.password = undefined
    // response
    res.status(statusCode).json({
        status: 'success',
        message: msg,
        data: {
            user, 
            token,
        },
    });
};


// USER SIGNUP  
exports.signup = async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    // validate input
    if (!(firstName && lastName && email && password && username)){
        return res.status(400).json({
            message: 'All fields are required!'
        })
    }

    // check if user already exists
    const oldUser = await User.findOne({ where: { email: email }})
    if (oldUser) {
        return res.status(400).json({
            status: 'fail',
            message: 'User already exists. Please login'
        })
    }

    // create new user
    const user = await User.create(req.body);

    // response message
    const msg = 'Account created successfully'

    // create token
    createSendToken(user, 201, res, msg)
}


exports.login = async (req, res) => {
    // get user input
    const { email, password } = req.body;
    // validate user input
    if(!(email && password)){ 
        return res.status(400).json({
            message: 'All fields are required!'
        })
    };
    // check if user exists
    const user = await User.findOne({
        where: { email: email}
    });

    // check user exists and password is correct without leaking extra info
    if(!user || !(await user.comparePassword(password))){
        return res.status(400).json({
            status: 'fail',
            message: 'Email or Password Incorrect'
        })
    }

    const msg = 'Login successful'

    // create token
    createSendToken(user, 200, res, msg)
}

