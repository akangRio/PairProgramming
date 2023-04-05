const Controller = require('../controller/controller')

const router = require('express').Router()

router.get('/', Controller.readStore)

module.exports = router