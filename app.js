const express = require('express')
const cookieParser = require('cookie-parser')

const appError = require('./utils/appError')
const logger = require('./utils/logger')
const morganMidWare = require('./utils/morgan')
const globalErrorHandler = require('./controllers/error.controller');

// routes import

const app = express()

// MORGAN MIDDLEWARE
app.use(morganMidWare)

// PARSE REQ.BODY
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// COOKIE PARSER
// app.use(cookieParser);

// ROUTES
// app.use('')

// home route
app.get('/', (req,res) => {
    logger.info('welcome')
    res.send('Welcome to the writing room')
})

// change req time format
app.use((req,res,next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// handle unknown request errs
app.all('*', (req,res,next) =>{
    return new appError(`${req.originalUrl} not found on server`, 404)
})

// register global error handler
app.use(globalErrorHandler)

module.exports = app 