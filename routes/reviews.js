const express = require('express')
const router = express.Router({ mergeParams: true })
const Listing = require('../models/listing.js')
const asyncWrap = require('../utils/asyncWrap.js')
const MyError = require('../utils/ExpressErr.js')
const Review = require('../models/review.js')
const { ReviewSchema } = require('../schema.js')
const { isLoggedin, isAuthor } = require('../middleware.js')
const { Addreview, deleteReview } = require('../Controllers/reviews.js')

const validateListing = (req, res, next) => {
    let { error } = ReviewSchema.validate(req.body);
    if (error) {
        console.log(error.details)

        throw new MyError(400, error)
    } else {
        next()
    }
}

//Review

router.post('/', isLoggedin, validateListing, Addreview)

router.delete('/:reviewId/delete', isLoggedin, isAuthor, asyncWrap(deleteReview))

module.exports = router;