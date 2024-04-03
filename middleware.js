const Listing = require("./models/listings");
const Review = require("./models/review");
const ExpressError = require("./util/ExpressError.js");
const {ListingSchema ,reviewSchema} = require("./schema.js");

// Middleware which authenticate the user is loggedIn or Not
module.exports.isLoggedIn = (req,res,next) => {
    // console.log(req.path, "----", req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Must Login First !!");
        return res.redirect("/login");
    }
    next();
}

// Middleware to save redirection url so that user get that page directly after login. 
module.exports.saveredirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;   
    }
    next();
}

// middleware to check that that the user who is editing or making any change in any listing is 
// actuatlly the owner of the that listing or NOT.
module.exports.isOwner = async(req,res,next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are Not Owner of this Post/Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// Validate middleware for the listing 
module.exports.validateListing = (req,res,next) =>{
    let {error} = ListingSchema.validate(req.body);
    // console.log(result);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

// Validate middleware for the Reviews 
module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    // console.log(result);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

// middleware to check that that the user who is deleting any review is 
// actuatlly the owner of the that review or NOT.
module.exports.isReviewAuthor = async(req,res,next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are Not Owner of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}