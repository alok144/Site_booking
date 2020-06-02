var express= require("express");
var router= express.Router();
var middleware= require("../middleware")// it will automatically require index file in middleware directory
passport= require("passport"),
User= require("../models/user"),

//route route
router.get("/", function(req,res){
    res.render("landing");
});
 
//**********Auth routes or index routes**********//
//signup form
router.get("/register", function(req,res){
    res.render("register");
});
//handling user signup
router.post("/register", function(req,res){
    //res.send("registered");
    var newUser=new User({username: req.body.username});
    //user.register will do all hash like things for us
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.render("register"); 
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success","welcome to YelpCamp "+user.username);
            res.redirect("/campgrounds");
        });
    });
});

//LOGIN ROUTES
//render login form
router.get("/login", function(req,res){
    res.render("login");
});
//handle sign in
//middleware
router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: "User is not registered please signup",
        successFlash: "welcome to YelpCamp "
    }), 
    function(req,res){//this is callback function
    res.render("login");
});

//LOGOUT ROUTES
router.get("/logout", function(req,res){
    req.logout();//request.logout()
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});


module.exports= router;