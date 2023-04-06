const Controller = require('../controller/controller')

const router = require('express').Router()

const authentication = (req, res, next) => {
	console.log(req.session, '<-- login authentication')
	if (req.session.userId) {
		next()
	} else {
		res.render('failAuth')
	}
}

const isAdmin = (req, res, next) => {
	console.log(req.session, '<-- admin authentication')
	if (req.session.role) next()
}

const isNotAdmin = (req, res, next) => {
	console.log(req.session, '<-- not admin authentication')
	if (!req.session.role) next()
}

router.get('/', authentication, isNotAdmin, Controller.readStore)
router.get('/admin', authentication, isAdmin, Controller.readStoreAdmin)
router.get('/logout', Controller.logout)
router.get('/:profid', Controller.readStore)
router.get('/:profid/addtocart/:id', Controller.addToCart)
router.get('/:profid/decrease/:id', Controller.decOrder)
router.get('/:profid/increase/:id', Controller.incOrder)

module.exports = router