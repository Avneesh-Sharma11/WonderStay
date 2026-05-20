const Listing = require('../models/listing.js')
const Review = require('../models/review.js')

module.exports.Addreview = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id;
    // console.log(newReview)
    listing.reviews.push(newReview);
    await newReview.save()
    await listing.save()
    req.flash("success", "New Review Successfully Added!")
    res.redirect(`/listings/${listing._id}`)
}

module.exports.deleteReview =async (req, res) => {
    let { id, reviewId } = req.params;
    let del = await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully Deleted!")
    res.redirect(`/listings/${id}`)
}