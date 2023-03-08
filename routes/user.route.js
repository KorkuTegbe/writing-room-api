const router = require('express').Router()
const authController = require('../controllers/auth.controller')
const { authorize } = require('../middleware/authorize')
const { userInputValidation } = require('../validators/user.validator')

router.post('/signup', userInputValidation, authController.signup)
router.post('/login', authController.login)

module.exports = router