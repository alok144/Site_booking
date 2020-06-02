var express= require("express");
var router= express.Router({mergeParams: true});
var Campground= require("../models/campground");
var Comment= require("../models/comment");
var middleware= require("../middleware")// it will automatically require index file in middleware directory

//comment new
router.get("/new", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new",{campground: campground});
        }
    });
});

//comment create
router.post("/", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                    req.flash("error","something went wrong");
                    res.redirect("/campgrounds");
                }else{
                    //add username and id to comment
                    comment.author.id= req.user._id;
                    comment.author.username= req.user.username;
                    //save comment
                    comment.save();
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect somewhere
                    req.flash("success","comment added successfully");
                    res.redirect("/campgrounds/"+campground._id);
                }
            });    
        }
    });
});

//comments edit form route
router.get("/:comment_id/edit",middleware.checkcommentOwnership, function(req,res){
    //res.send("edit the comment");
    Campground.findById(req.params.id, function(err,foundCampground){
        if(err){
            res.redirect("back");
        }
        else{
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    res.redirect("back");
                }
                else{
                    res.render("comments/edit",{campground: foundCampground, comment: foundComment});
                }
            })
        }
    });
});

//comments update route
router.put("/:comment_id",middleware.checkcommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedCommment){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

//Destroy or Delete commment
router.delete("/:comment_id",middleware.checkcommentOwnership, function(req, res){
    //res.send("delete");
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});


module.exports= router;