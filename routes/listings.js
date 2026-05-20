const express = require('express')
const router = express.Router()
const Listing = require('../models/listing.js')
const asyncWrap = require('../utils/asyncWrap.js')
const { isLoggedin, isOwner, validateListing } = require('../middleware.js')
const { index, renderNewForm, AddNewListing, showListing, deleteListing, renderEditForm, updateListing } = require('../Controllers/listings.js')
const multer = require('multer')
const { storage } = require('../cloudConfig.js')
const upload = multer({ storage })


router
    .route('/')
    .get(index)
    .post(isLoggedin, upload.single('list[image]'), validateListing, AddNewListing)


// Add new listings
router.get('/new', isLoggedin, renderNewForm)

router
    .route('/:id')
    .get(showListing)
    .put(isLoggedin, isOwner, upload.single('image'), asyncWrap(updateListing))
    .delete(isLoggedin, isOwner, asyncWrap(deleteListing))

//Edit listing
router.get('/:id/edit', isLoggedin, isOwner, renderEditForm)

module.exports = router;