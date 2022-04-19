const express = require('express')
const router = express.Router({ mergeParams: true })

const Review = require('../models/review')
const Campground = require('../models/campground')

//joi = campgroundSchema e um modo de authenticacao
const { reviewSchema } = require('../schemas')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body)
  if (error) {
    console.log(error)
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

router.post(
  '/',
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = await new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Avaliação Feita!')
    res.redirect(`/campgrounds/${campground._id}`)
  })
)

//para pagar uma review demtro de um campground
router.delete('/:reviewId', async (req, res) => {
  const { id, reviewId } = req.params
  //"reviews" children do "campground" apaga um unico "review"
  await Review.findByIdAndDelete(reviewId)
  //apagar vestigio do "review" que foi apago do "Campground.reviews" $pull significa msm q "delete"
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })

  req.flash('success', 'Avaliação Apagada!')
  res.redirect(`/campgrounds/${id}`)
})

module.exports = router
