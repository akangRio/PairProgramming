const Controller = require('../controller/controller')

const router = require('express').Router()

const {uploadSingle} = require('../helpers/multer')

const multer  = require('multer')
const upload = multer({ dest: './public/' })

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

router.get('/addCoffee', authentication, isAdmin, Controller.addCoffeeForm)
router.post('/addCoffee', authentication, isAdmin, uploadSingle, Controller.postCoffeeForm)
router.get('/profilelist', Controller.profileList)

// router.get('/admin/delete/:coffeeId', authentication, isAdmin, Controller.delete)
router.get('/:profid/addtocart/:coffeeId', authentication, Controller.addToCart)
router.get('/:profid/decrease/:coffeeId', authentication, Controller.decOrder)
router.get('/:profid/increase/:coffeeId', authentication, Controller.incOrder)


module.exports = router