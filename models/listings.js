const mongoose = require("mongoose");
const Reviews = require("./review.js");
const listingSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
    },
    image:{
        url: String,
        filename: String
    },
    price:{
        type: Number,
    },
    location:{
        type: String,
    },
    country:{
        type: String,
    },
    reviews:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviews"
      },
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

// Passing middleware so that it will delete all reviews related to any listing
listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await Reviews.deleteMany({_id: {$in: listing.reviews}});
    }
})

const Listing = new mongoose.model("Listing", listingSchema);
module.exports = Listing;