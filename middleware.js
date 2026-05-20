const Listing = require("./models/listing.js")
const { listingSchema } = require('./schema.js')
const MyError = require('./utils/ExpressErr.js')
const Review = require("./models/review.js")

module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be logged In")
        return res.redirect('/login')
    }
    next();
}
module.exports.saveRedirectURL = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.redirectURL = req.session.returnTo;
    }
    next();
}
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the owner of this listing")
        return res.redirect(`/listings/${id}`)
    }
    next();
}
module.exports.isAuthor = async (req, res, next) => {
    const { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the author of this review")
        return res.redirect(`/listings/${id}`)
    }
    next();
}
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        console.log(error.details)
        throw new MyError(400, error)
    } else {
        next()
    }
}