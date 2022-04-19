const express = require('express')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')

router.get('/register', (req, res) => {
  res.render('users/register')
})

router.post(
  '/register',
  catchAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body
      const user = new User({ username, email })
      const registerdUser = await User.register(user, password)
      req.login(registerdUser, (err) => {
        if (err) return next(err)
        req.flash('success', 'Usuario registrado com successo')
        res.redirect('/campgrounds')
      })
    } catch (error) {
      req.flash('error', error.message)
      res.redirect('/register')
    }
  })
)

router.get('/login', (req, res) => {
  res.render('users/login')
})

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  (req, res) => {
    req.flash('success', 'Login successfuly')
    res.redirect('/campgrounds')
  }
)

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success', 'goodbye')
  res.redirect('/campgrounds')
})

module.exports = router
