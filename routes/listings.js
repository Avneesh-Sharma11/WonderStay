const express = require('express')
const router = express.Router()
const Listing = require('../models/listing.js')
const asyncWrap = require('../utils/asyncWrap.js')
const MyError = require('../utils/ExpressErr.js')
const { listingSchema } = require('../schema.js')

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        console.log(error.details)
        throw new MyError(400, error)
    } else {
        next()
    }
}

// All listings

router.get('/', async (req, res) => {
    let AllListings = await Listing.find({});
    res.render('listings/index.ejs', { AllListings })
})

// Add new listings
router.get('/new', (req, res) => {
    res.render('listings/new.ejs')
})
router.post('/', validateListing, async (req, res, next) => {

    const NewList = new Listing(req.body.list)
    req.flash("success", "New Listing Successfully Added!")
    await NewList.save();
    res.redirect("/listings")
})

//Show listing


router.get('/:id', async (req, res) => {

    let { id } = req.params;
    let user = await Listing.findById(id).populate('reviews');
    if (!user) {
        req.flash("error", "Listing you requested for does not exist!")
        return res.redirect('/listings')
    }
    res.render('listings/show.ejs', { user })
})

//Delete listing

router.delete('/:id', asyncWrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted!")
    res.redirect('/listings')
}))

//Edit listing

router.get('/:id/edit', async (req, res, next) => {
    try {
        let { id } = req.params;
        let user = await Listing.findById(id);
        if (!user) {
            req.flash("error", "Listing you requested for edit does not exist!")
            return res.redirect('/listings')
        }
        res.render('listings/edit.ejs', { user });
    } catch (err) {
        next(err)
    }
})
router.put('/:id', asyncWrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body);
    req.flash("success", "Successfully Updated!")
    res.redirect('/listings');
}))

module.exports = router;