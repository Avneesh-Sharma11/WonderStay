const joi = require('joi');

module.exports.listingSchema = joi.object({
    list: joi.object({
        tital: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().required().min(0),
    }).required(),
});

module.exports.ReviewSchema = joi.object({
    review: joi.object({
        Comment: joi.string().required(),
        rating: joi.number().required().min(1).max(5),
        createdAt: joi.date().optional()
    }).required(),
})