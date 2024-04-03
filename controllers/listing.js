const Listing = require("../models/listings");

module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
}

module.exports.renderNewFrom = (req,res)=>{
    res.render("./listings/new.ejs");
}

module.exports.showListing =  async(req,res)=>{
    let {id} = req.params;
    let listingData = await Listing.findById(id)
    .populate({path: "reviews", populate: {
        path: "author",
        },
    })
    .populate("owner");
    if(!listingData){
        req.flash("error", "Listing you are requested for does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", {listingData});
}

module.exports.createListings = async(req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.Listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}

module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you are requested for does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url; // Here we are downgrading the image quality for 
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_100"); // Edit page image
    res.render("./listings/edit.ejs", {listing, originalImageUrl});
}

module.exports.updateListing = async(req,res)=>{
    if(!req.body.Listing){
        throw new ExpressError(400, "Bad Request");
    }
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.Listing});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }

    req.flash("success", "Listing Updated Successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.searchedListing = async (req,res,next)=>{
    let { searchPlace } = req.query;
    let searchedListings = await Listing.find({location: `${searchPlace}`});
    if(searchedListings.length > 0){
        res.render("./listings/searchPage.ejs", {searchedListings});
    }else{
        let allListings = await Listing.find({});
        res.render("./listings/resultNotFoundPage.ejs", {allListings});
    }  
}

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}