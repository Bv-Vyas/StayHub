const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

main().then(()=>{
    console.log("Database is listening");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

async function initDB(){
    await Listing.deleteMany({});
    initData.data = initData.data.map( (obj) => ({...obj, owner: '6601111a738ff5410ac27dee'}));
    await Listing.insertMany(initData.data);
    console.log("Data initialized");
}

initDB();