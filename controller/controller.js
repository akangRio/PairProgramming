const { User, Profile, Coffee, Order } = require('../models/index')
const session = require('express-session')
const bcryptjs = require('bcryptjs')

class Controller {
  static readHome(req, res) {
    res.render('home')
  }

  static loginForm(req, res) {
    const errors = req.query.errors
    res.render('login', { errors })
  }

  static login(req, res) {
    const { email, password } = req.body
    let id;
    let role;

    let errors = []

    if (!email) errors.push('Email is required!')
    if (!password) errors.push('Password is required!')
    if (errors.length > 0) {
      return res.redirect(`/login?errors=${errors}`);
    }

    User.findOne({
      where: {
        email: email
      }
    })
      .then(data => {
        if (!data) {
          errors.push('Email not found!')
          throw new Error('emailNotFound')
        }
        else {
          id = data.id
          role = data.isAdmin
          return bcryptjs.compare(password, data.password)
        }
      })
      .then(isValid => {
        if (isValid) {
          req.session.userId = id
          req.session.role = role

          if (req.session.role) {
            res.redirect('/store/admin')
          } else {
            res.redirect('/store')
          }
        } else {
          errors.push('Invalid password!')
          throw new Error('invalidPassword')
        }
      })
      .catch(err => {
        console.log(err)
        if (err.message === 'emailNotFound' || err.message === 'invalidPassword') {
          res.redirect(`/login?errors=${errors}`)
        } else {
          res.send(err)
        }
      })
  }

  static register(req, res) {
    res.render('register')
  }

  static readStoreAdmin(req, res) {
    Coffee.findAll()
      .then(data => res.render('storeAdmin', { data }))
      .catch(err => {
        console.log(err)
        res.send(err)
      })
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