const Joi = require("joi");

module.exports.ListingSchema = Joi.object({
    Listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        country: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().min(0),
        image: Joi.string().allow("", null),
    }).required(),
}); 

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        content: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required(),
    }).required(),
})