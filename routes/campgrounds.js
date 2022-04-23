if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const router = express.Router()
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router
  .route('/')
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array('image'),
    validateCampground,
    catchAsync(campgrounds.newCampground)
  )

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router
  .route('/:id')
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array('image'),
    validateCampground,
    catchAsync(campgrounds.editCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.delete))

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
)

module.exports = router
