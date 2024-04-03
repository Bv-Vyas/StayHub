const User = require("../models/user");

module.exports.renderSignUpForm = (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.signUp = async (req,res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");
        })
    }catch(err){
        console.log(err);
        res.redirect("signup");
    }
}

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
}

module.exports.Login = async (req,res) => {
    req.flash("success", "Login Successfully");
    let rediractUrl = res.locals.rediractUrl || "/listings"; // While login empty path is coming so we are adding "/listing" at that time.
    res.redirect(rediractUrl);
}

module.exports.LogOut = (req,res,next) => {
    req.logOut((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are Logged Out !");
        res.redirect("/listings");
    })
}