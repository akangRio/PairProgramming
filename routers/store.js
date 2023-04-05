const Controller = require('../controller/controller')

const router = require('express').Router()

const authentication = (req, res, next) => {
    console.log(req.session);
    if (req.session.userId !== null) {
        next()
    } else {
        res.send('LOGIN PAK')
    }
}

router.get('/', authentication, Controller.readStore)
router.get('/logout', Controller.logout)

module.exports = router