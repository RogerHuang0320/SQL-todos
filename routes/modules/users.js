const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const router = express.Router()
const { User } = require('../../models/user')

router.get('/login', (req, res) => {
  return res.render('login')
})

// router.post('/login', passport.authenticate("local", {
//   successRedirect: '/',
//   failureRedirect: '/users/login'
// }))

router.post('/login',
  passport.authenticate("local", { failureRedirect: '/users/login', failureMessage: true }),
  function (req, res) {
    res.redirect('/');
  }
)

// successRedirect: '/',

// app.post('/login/password',
//   passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
//   function (req, res) {
//     res.redirect('/~' + req.user.username);
//   });









router.get('/register', (req, res) => {
  return res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必填。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  User.findOne({ where: { email } }).then(user => {
    if (user) {
      console.log('User already exists')
      return res.render('register', {
        name,
        email,
        password,
        confirmPassword
      })
    }
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

router.get('/logout', (req, res, next) => {
  req.logout()  //Passport.js 提供的函式，會幫你清除 session
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router
