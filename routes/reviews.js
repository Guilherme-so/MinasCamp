const express = require('express')
const router = express.Router({ mergeParams: true })

const Review = require('../models/review')
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const { validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')

router.post(
  '/',
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.owner = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Avaliação Feita!')
    res.redirect(`/campgrounds/${campground._id}`)
  })
)

//para pagar uma review demtro de um campground
router.delete('/:reviewId', isLoggedIn, isReviewAuthor,async (req, res) => {
  const { id, reviewId } = req.params
  //"reviews" children do "campground" apaga um unico "review"
  await Review.findByIdAndDelete(reviewId)
  //apagar vestigio do "review" que foi apago do "Campground.reviews" $pull significa msm q "delete"
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })

  req.flash('success', 'Avaliação Apagada!')
  res.redirect(`/campgrounds/${id}`)
})

module.exports = router
