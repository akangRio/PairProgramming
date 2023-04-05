const Controller = require('../controller/controller')

const router = require('express').Router()

router.get('/', Controller.readHome)

router.get('/login', Controller.loginForm)
router.post('/login', Controller.login)

router.get('/register', Controller.registerForm)
router.post('/register', Controller.register)

module.exports = router