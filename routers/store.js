const Controller = require('../controller/controller')

const router = require('express').Router()

const authentication = (req, res, next) => {
	console.log(req.session, '<-- login authentication')
	if (req.session.userId) {
		next()
	} else {
		res.send('Please log in to continue')
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

router.get('/admin', authentication, isAdmin, Controller.readStoreAdmin)
router.get('/', authentication, isNotAdmin, Controller.readStore)


router.get('/logout', Controller.logout)

module.exports = router