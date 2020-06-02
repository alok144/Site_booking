//all middleware goes here
var Campground= require("../models/campground");
var Comment= require("../models/comment");

var middlewareObj= {};

middlewareObj.checkcampgroundOwnership= function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundcampground){
            if(err){
                req.flash("error","campground not found");
                res.redirect("back");
            }
            else{
                //does user own the campground
                if(foundcampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    //res.send("you don't have permission");
                    req.flash("error","you don't have permission to do that");
                    res.redirect("back");
                }
                //console.log(req.user._id);//this is string
                //console.log(foundcampground.author.id);//this is mongoose object 
            }
        });
    }else{//if not.........redirect
        //res.send("you must logged in");
        req.flash("error","you need to be logged in to do that");
        res.redirect("back"); 
    }
}

middlewareObj.checkcommentOwnership= function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundcomment){
            if(err){
                res.redirect("back");
            }
            else{
                //does user own the comment??
                if(foundcomment.author.id.equals(req.user._id)){
                    next();
                }else{
                    //res.send("you don't have permission");
                    req.flash("error","you don't have permission to do that");
                    res.redirect("back");
                }
                //console.log(req.user._id);//this is string
                //console.log(foundcomment.author.id);//this is mongoose object 
            }
        });
    }else{//if not.........redirect
        //res.send("you must logged in");
        req.flash("error","you need to be logged in to do that");
        res.redirect("back"); 
    }
}

middlewareObj.isLoggedIn= function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");//"error" is key and "Please login first" is value 
    res.redirect("/login");
}


module.exports= middlewareObj;