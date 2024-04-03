const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const Listing = require("../models/listings.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });
const listingContoller = require("../controllers/listing.js");

// Index Route
router
    .route("/")
    .get(wrapAsync(listingContoller.index)) // index Route
    .post(isLoggedIn,
        upload.single('Listing[image]'), 
        validateListing,
        wrapAsync(listingContoller.createListings) // Create Route
);

// Searching route
router.get("/searchbar", 
        wrapAsync(listingContoller.searchedListing) //Searching route
);

//New Route
router.get("/new", 
        isLoggedIn, 
        listingContoller.renderNewFrom);

//Show Route
router
    .route("/:id")
    .get(wrapAsync(listingContoller.showListing)) // Show Route
    .put(isLoggedIn,
        isOwner,
        upload.single('Listing[image]'), 
        validateListing,
        wrapAsync(listingContoller.updateListing)) // Update Route
    .delete( 
        isLoggedIn,
        isOwner, 
        wrapAsync(listingContoller.deleteListing) // Delete Route
    );

// Edit Route
router.get("/:id/edit", 
    isLoggedIn,
    isOwner,
    wrapAsync(listingContoller.editListing));



module.exports = router;