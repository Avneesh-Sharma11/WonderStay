const express = require('express')
const router = express.Router({mergeParams : true})
const Listing = require('../models/listing.js')
const asyncWrap = require('../utils/asyncWrap.js')
const MyError = require('../utils/ExpressErr.js')
const Review = require('../models/review.js')
const { ReviewSchema } = require('../schema.js')

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

router.post('/', validateListing, async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review)
    console.log(listing)
    console.log(newReview)
    listing.reviews.push(newReview);
    await newReview.save()
    await listing.save()
    req.flash("success", "New Review Successfully Added!")
    res.redirect(`/listings/${listing._id}`)
})
router.delete('/:id1/delete', asyncWrap(async (req, res) => {
    let { id, id1 } = req.params;
    let del = await Review.findByIdAndDelete(id1);
    req.flash("success", "Successfully Deleted!")
    res.redirect(`/listings/${id}`)
}))

module.exports = router;