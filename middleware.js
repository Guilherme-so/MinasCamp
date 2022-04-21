const Campground = require('./models/campground')
const { campgroundSchema, reviewSchema } = require('./schemas')
const { ExpressError } = require('./utils/ExpressError')
const  Review  = require('./models/review')

module.exports.isLoggedIn = (req, res, next) => {
  //salvar o caminho antes de ser redirecionado para loggin
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl
    req.flash('error', 'You must sing in first')
    return res.redirect('/login')
  }
  next()
}

//middleware para validar server side com Joi
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

//middleware de Authorizacao
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  if (!campground.owner.equals(req.user._id)) {
    req.flash('error', 'Você não tem permissão para fazer isso!')
    return res.redirect(`/campgrounds/${id}`)
  }
  next()
}

//middleware de Authorizacao review
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params
  const review = await Review.findById(reviewId)
  if (!review.owner.equals(req.user._id)) {
    req.flash('error', 'Você não tem permissão para fazer isso!')
    return res.redirect(`/campgrounds/${id}`)
  }
  next()
}

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body)
  if (error) {
    console.log(error)
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}
