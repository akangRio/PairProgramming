const Controller = require('../controller/controller')

const router = require('express').Router()

router.get('/:profid', Controller.readStore)
router.get('/:profid/addtocart/:id', Controller.addToCart)
router.get('/:profid/decrease/:id', Controller.decOrder)
router.get('/:profid/increase/:id', Controller.incOrder)

module.exports = router