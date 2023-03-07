const router = require('express').Router()
const authController = require('../controllers/auth.controller')
const { authorize } = require('../middleware/authorize')

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.get('/me', authorize, (req,res)=>{
    console.log('yhyh')
})

module.exports = router