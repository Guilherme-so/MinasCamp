const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const { campgroundSchema } = require('../schemas')
const {isLoggedIn} = require("../middleware")

//middleware para validar server side com Joi
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

router.get(
  '/',
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
  })
)

router.get('/new',isLoggedIn,(req, res) => {
  res.render('campgrounds/new')
})


router.post(
  '/',
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
    const campground = new Campground(req.body.campground)
    await campground.save()
    req.flash('success', 'Acampamento criado com successo')
    res.redirect(`/campgrounds/${campground._id}`)
  })
)

router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      'reviews'
    )
    if (!campground) {
      req.flash('error', 'Acampamento Não Encontrado')
      return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
  })
)

router.get(
  '/:id/edit',
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
      req.flash('error', 'Acampamento Não Encontrado')
      return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
  })
)

router.put(
  '/:id',
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    })
    req.flash('success', 'Alteração feita com successo')
    res.redirect(`/campgrounds/${campground._id}`)
  })
)

router.delete(
  '/:id',
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Acampamento apagado com successo')
    res.redirect('/campgrounds')
  })
)

module.exports = router