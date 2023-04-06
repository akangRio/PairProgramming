const router = require('express').Router()
const homeRouter = require('./homeLogin')
const storeRouter = require('./store')


router.use('/store', storeRouter)
router.use('/', homeRouter)

module.exports = router