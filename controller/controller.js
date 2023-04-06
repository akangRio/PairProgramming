const { where } = require('sequelize')
const { User, Profile, Coffee, Order } = require('../models/index')
const session = require('express-session')
const bcryptjs = require('bcryptjs')

class Controller {
  static readHome(req, res) {
    res.render('home')
  }

  static loginForm(req, res) {
    const errors = req.query.errors
    const registered = req.query.success
    res.render('login', { errors, registered })
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

  static registerForm(req, res) {
    const errors = req.query.errors
    res.render('register', { errors })
  }

  static register(req, res) {
    const { username, email, password, passwordConfirm, name, address, phone } = req.body
    let errors = []
    if (password !== passwordConfirm) {
      errors.push(`Password doesn't match`)
      return res.redirect(`/register?errors=${errors}`)
    }
    User.create({
      username,
      email,
      password
    })
      .then((data) => {
        return Profile.create({
          name,
          address,
          phone,
          UserId: data.id
        })
      })
      .then(() => res.redirect('/login?success=Register+success!'))
      .catch(err => {
        if (err.name === 'SequelizeValidationError') {
          err.errors.forEach(el => errors.push(el.message))
          res.redirect(`/register?errors=${errors}`)
        } else {
          console.log(err)
          res.send(err)
        }
      })
  }

  // =================================================================

  static readStoreAdmin(req, res) {
    const userId = req.session.userId
    let data
    Coffee.findAll()
    .then(coffee => {
      data = coffee
      return  Profile.findOne({
        where : {UserId : userId},
        include : [{
          model : Order,
          include :[{
            model : Coffee,
            order : ['name', 'ASC']
          }],
          order : ['id', 'ASC']
        }]
      })
    })
    .then(profile => {
      res.render('storeAdmin', {data, profile})
    })
    .catch(err => {
      console.log(err)
        res.send(err)
    })
  }

  static addCoffeeForm(req, res) {
    const errors = req.query.errors
    res.render('addCoffee', {errors})
  }

  static postCoffeeForm(req, res) {
    const {name, price, category} = req.body
    const image = `/images/${req.file.filename}`;
    Coffee.create({
      name,
      image,
      price,
      category
    })
      .then(() => res.redirect('/store/admin'))
      .catch(err => {
        console.log(err)
        res.send(err)
      })
  }

  // ================ NOT ADMIN ================

  static readStore(req, res) {
    const userId = req.session.userId
    let data
    Coffee.findAll()
    .then(coffee => {
      data = coffee
      return  Profile.findOne({
        where : {UserId : userId},
        include : [{
          model : Order,
          include :[{
            model : Coffee,
            order : ['name', 'ASC']
          }],
          order : ['id', 'ASC']
        }]
      })
    })
    .then(profile => {
      res.render('store', {data, profile})
    })
    .catch(err => {
      console.log(err)
        res.send(err)
    })
  }

  static addToCart(req, res){
    const {coffeeId, profid} = req.params
    let saveProfile
    let saveCoffee

    Coffee.findOne({
      where:{id: coffeeId}
    })
    .then(coffee => {
      saveCoffee = coffee
      return Profile.findOne({
        where :{id : profid}
      })
    })
    .then(profile => {
      saveProfile = profile
      return Order.findOne({where : {
        CoffeeId : coffeeId,
        ProfileId : profid
      }})
    })
    .then(order => {
      if(order){
        return Order.increment({quantity : 1}, {where : {CoffeeId : coffeeId}})
      } else {
        return Order.create({
          basePrice : saveCoffee.price,
          address : saveProfile.address,
          ProfileId : profid,
          CoffeeId : coffeeId
        })
      }
    })
    .then(result => {
      res.redirect(`/store`)
    })
    .catch(err => {
      console.log(err);
      res.send(err)
    })
   
  }

  static decOrder(req, res){
    const {coffeeId, profid} = req.params
    Order.decrement({quantity : 1}, {where : {CoffeeId : coffeeId}})
    .then(order => {
      res.redirect(`/store`)
    })
    .catch(err => {
      res.send(err)
    })

  }

  static incOrder(req, res){
    const {coffeeId, profid} = req.params
    Order.increment({quantity : 1}, {where : {CoffeeId : coffeeId}})
    .then(order => {
      res.redirect(`/store`)
    })
    .catch(err => {
      console.log(err);
      res.send(err)
    })
  }


  // static addToCart(req, res){
  //   const {id, profid} = req.params
  //   let saveProfile
  //   let saveCoffee

  //   Coffee.findOne({
  //     where:{id}
  //   })
  //   .then(coffee => {
  //     saveCoffee = coffee
  //     return Profile.findOne({
  //       where :{id : profid}
  //     })
  //   })
  //   .then(profile => {
  //     saveProfile = profile
  //     return Order.findOne({where : {
  //       CoffeeId : id,
  //       ProfileId : profid
  //     }})
  //   })
  //   .then(order => {
  //     if(order){
  //       return Order.increment({quantity : 1}, {where : {CoffeeId : id}})
  //     } else {
  //       return Order.create({
  //         basePrice : saveCoffee.price,
  //         address : saveProfile.address,
  //         ProfileId : profid,
  //         CoffeeId : id
  //       })
  //     }
  //   })
  //   .then(result => {
  //     res.redirect(`/store/${profid}`)
  //   })
  //   .catch(err => {
  //     res.send(err)
  //   })
   
  // }

  // static decOrder(req, res){
  //   const {id, profid} = req.params
  //   Order.decrement({quantity : 1}, {where : {CoffeeId : id}})
  //   .then(order => {
  //     res.redirect(`/store/${profid}`)
  //   })
  //   .catch(err => {
  //     res.send(err)
  //   })

  // }

  // static incOrder(req, res){
  //   const {id, profid} = req.params
  //   Order.increment({quantity : 1}, {where : {CoffeeId : id}})
  //   .then(order => {
  //     res.redirect(`/store/${profid}`)
  //   })
  //   .catch(err => {
  //     res.send(err)
  //   })
  // }

  static logout(req, res) {
    req.session.userId = null
    res.redirect('/')
  }

  static profileList(req, res){
    const {search} = req.query
    Profile.listAll(search)
    .then(profiles => {
      console.log(profiles);
      res.render('profileList', {profiles})
    })
    .catch(err => {
      console.log(err);
      res.send(err)
    })
  }

  static delete(req, res) {
    const id = req.params.coffeeId

    Coffee.destroy({
      where: {
        id: id
      }
    })
      .then(() => res.redirect('/store/admin'))
      .catch(err => {
        console.log(err);
        res.send(err)
      })
  }

}

module.exports = Controller