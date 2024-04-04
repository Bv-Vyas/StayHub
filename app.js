if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./util/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//Routers
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const Listing = require('./models/listings.js');

// Database url
const Dburl = process.env.ATLASDB_URL;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main().then(()=>{
    console.log("Database is listening");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(Dburl);
}


const store = MongoStore.create({
    mongoUrl: Dburl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("Error in MONGO session store", err);
} )

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 8 * 24 * 60 * 60 * 1000,
        maxAge: 8 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOption));
// flash
app.use(flash());
app.use(express.json());


// code for the user authentication and authorization by using the passport NPM library
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware for the flash message
app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// Home Path or '/'
app.get("/", async (req,res) =>{
    let allListings = await Listing.find();
    res.render("listings/index.ejs", {allListings});
})

//using listing and review routes
app.use("/listings", listingRouter);
app.use("/listings/:id/review", reviewRouter);
app.use("/", userRouter);


app.all("*", (req,res,next) => {
    next(new ExpressError(404, "Page Not Found !"));
})

app.use((err,req,res,next) =>{
    let {statusCode = 500 , message = "Something Went Wrong"} = err;
    res.status(statusCode).render("./listings/error.ejs", {message});
})

app.listen(8080, ()=>{
    console.log("App is listening on the port 8080");
})