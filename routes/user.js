const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../util/wrapAsync");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware");

const userControllers = require("../controllers/users");

router
.route("/signup")
.get(userControllers.renderSignUpForm) // SignUp Route GET
.post(wrapAsync(userControllers.signUp)); // SignUp Route POST

router
.route("/login")
.get(userControllers.renderLoginForm) // Login Route GET
.post( 
    saveredirectUrl, 
    passport.authenticate("local", {
    failureRedirect: "/login", 
    failureFlash: true
    }), 
    userControllers.Login // Login Route POST
);

// LogOut Route
router.get("/logout", userControllers.LogOut);

module.exports = router;