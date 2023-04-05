const { User, Profile, Coffee, Order } = require('../models/index')
const session = require('express-session')
const bcryptjs = require('bcryptjs')

class Controller {
  static readHome(req, res) {
    res.render('home')
  }

  static loginForm(req, res) {
    res.render('login')
  }

  static login(req, res) {
    const { email, password } = req.body
    let id;

    User.findOne({
      where: {
        email: email
      }
    })
      .then(data => {
        id = data.id
        if (!data) res.send('gaada akun')
        else {
          return bcryptjs.compare(password, data.password)
        }
      })
      .then(isValid => {
        if (isValid) {
          req.session.userId = id;
          res.redirect('/store')
        } else {
          res.send('GAADAAAA')
        }
      })
      .catch(err => {
        console.log(err)
        res.send(err)
      })
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

  static logout(req, res) {
    req.session.userId = null
    res.redirect('/')
  }
}

module.exports = Controller