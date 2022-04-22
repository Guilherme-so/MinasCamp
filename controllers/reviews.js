const Campground = require('../models/campground')
const Review = require('../models/review')

module.exports.createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  const review = new Review(req.body.review)
  review.owner = req.user._id
  campground.reviews.push(review)
  await review.save()
  await campground.save()
  req.flash('success', 'Avaliação Feita!')
  res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params
  //"reviews" children do "campground" apaga um unico "review"
  await Review.findByIdAndDelete(reviewId)
  //apagar vestigio do "review" que foi apago do "Campground.reviews" $pull significa msm q "delete"
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })

  req.flash('success', 'Avaliação Apagada!')
  res.redirect(`/campgrounds/${id}`)
}
