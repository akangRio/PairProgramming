const { where } = require('sequelize')
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
    const {profid} = req.params
    let data
    Coffee.findAll()
    .then(coffee => {
      data = coffee
      return  Profile.findOne({
        where : {id : profid},
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
    const {id, profid} = req.params
    let saveProfile
    let saveCoffee

    Coffee.findOne({
      where:{id}
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
        CoffeeId : id,
        ProfileId : profid
      }})
    })
    .then(order => {
      if(order){
        return Order.increment({quantity : 1}, {where : {CoffeeId : id}})
      } else {
        return Order.create({
          basePrice : saveCoffee.price,
          address : saveProfile.address,
          ProfileId : profid,
          CoffeeId : id
        })
      }
    })
    .then(result => {
      res.redirect(`/store/${profid}`)
    })
    .catch(err => {
      res.send(err)
    })
   
  }

  static decOrder(req, res){
    const {id, profid} = req.params
    Order.decrement({quantity : 1}, {where : {CoffeeId : id}})
    .then(order => {
      res.redirect(`/store/${profid}`)
    })
    .catch(err => {
      res.send(err)
    })

  }

  static incOrder(req, res){
    const {id, profid} = req.params
    Order.increment({quantity : 1}, {where : {CoffeeId : id}})
    .then(order => {
      res.redirect(`/store/${profid}`)
    })
    .catch(err => {
      res.send(err)
    })
  }

}

module.exports = Controller