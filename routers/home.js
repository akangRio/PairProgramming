const Controller = require('../controller/controller')

const router = require('express').Router()

router.get('/', Controller.readHome)
router.get('/login', Controller.login)
router.get('/register', Controller.register)

module.exports = router