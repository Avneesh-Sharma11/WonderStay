const Listing = require('../models/listing.js')
const { cloudinary } = require('../cloudConfig.js')

module.exports.index = async (req, res) => {
    let AllListings = await Listing.find({});
    res.render('listings/index.ejs', { AllListings })
}

module.exports.renderNewForm = (req, res) => {
    res.render('listings/new.ejs')
}

module.exports.AddNewListing = async (req, res, next) => {
    const url = req.file.path;
    const filename = req.file.filename;
    const NewList = new Listing(req.body.list)
    NewList.owner = req.user._id;
    NewList.image = { url, filename }
    // console.log(NewList)
    await NewList.save();
    req.flash("success", "New Listing Successfully Added!")
    res.redirect("/listings")
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let user = await Listing.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('owner');
    if (!user) {
        req.flash("error", "Listing you requested for does not exist!")
        return res.redirect('/listings')
    }
    // console.log(user)
    res.render('listings/show.ejs', { user })
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (listing.image && listing.image.filename) {
        await cloudinary.uploader.destroy(listing.image.filename);
    }
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted!")
    res.redirect('/listings')
}

module.exports.renderEditForm = async (req, res, next) => {
    try {
        let { id } = req.params;
        let user = await Listing.findById(id);
        if (!user) {
            req.flash("error", "Listing you requested for edit does not exist!")
            return res.redirect('/listings')
        }
        let newUrl = user.image.url.replace(
            "/upload",
            "/upload/w_300,q_auto"
        );
        res.render('listings/edit.ejs', { user,newUrl });
    } catch (err) {
        next(err)
    }
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body);
    if (typeof req.file !== 'undefined') {
        if (listing.image && listing.image.filename) {
            await cloudinary.uploader.destroy(listing.image.filename);
        }
        const url = req.file.path;
        const filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Successfully Updated!")
    res.redirect(`/listings/${id}`);
}