const router = require('express').Router()

const {viewRegister, register, login, viewLogin, whoiami} = require('../controllers/users.controller')
const passport = require('../utils/passport')

const { validate } = require('../middlewares/validation.midleware')
const { registerSchema } = require('../schemas/register.schema')
const { verify } = require('../middlewares/verify.middleware')

router.get('/', function(req, res){
	res.render('index')
})

router.get('/register', viewRegister)
router.post('/register', validate(registerSchema), register)

router.post('/login/web', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}))

router.post('/login', login)
router.get('/login', viewLogin)

router.get('/whoiami', verify, whoiami)

module.exports = router