const { User, Profile, Coffee, Order } = require('../models/index')

class Controller {
  static readHome(req, res) {
    res.render('home')
  }

  static login(req, res) {
    res.render('login')
  }

  static register(req, res) {
    res.render('register')
  }

  static readStore(req, res) {
    Coffee.findAll()
      .then(data => res.render('store', { data }))
      .catch(err => {
        console.log(err)
        res.send(err)
      })
  }
}

module.exports = Controller