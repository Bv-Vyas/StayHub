const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../util/wrapAsync.js");
const Reviews = require("../models/review.js");
const Listing = require("../models/listings.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewControllers = require("../controllers/reviews.js")

//POST route for Reviews
router.post("/",
    isLoggedIn,
    validateReview, 
    wrapAsync(reviewControllers.createReviews));

//Delete route for Reviews
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewControllers.destroyReview));

module.exports = router;