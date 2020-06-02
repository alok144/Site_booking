var express= require("express");
var router= express.Router();
var Campground= require("../models/campground");
var middleware= require("../middleware")// it will automatically require index file in middleware directory

//show all campgrounds ************ index route
router.get("/", function(req,res){
    //res.render("campgrounds", {campgrounds:campgrounds});
    //selecting all campgrounds from database
    //console.log(req.user); //this contain data about user
    Campground.find({},
        function(err,allcampgrounds){
            if(err)
            {
                console.log(err);
            }
            else
            {
                //res.render("campgrounds/index",{campgrounds: allcampgrounds, currentUser: req.user});
                res.render("campgrounds/index",{campgrounds: allcampgrounds});
            }
        });
});

//new form of campground
router.get("/new",middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

//create campground
router.post("/",middleware.isLoggedIn, function(req,res){
    //get data from form and add to campgrounds array
    //redirect back to campgrounds page 
    //res.send("you hit the post route");
    var name= req.body.name;
    var image= req.body.image;
    var description= req.body.description;
    var price= req.body.price;
    var author={
        id: req.user._id,
        username: req.user.username
    }
    var newcampground= {name: name, image: image, description:description, author: author, price: price};
    //campgrounds.push(newcampground);
    //create new campground and save to database

    Campground.create(
        newcampground,
        
        function(err,Campgroundd){ 
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(Campgroundd);
            res.redirect("/campgrounds/"+Campgroundd._id);
        }
    });

    //redirect back to campgrounds
    //res.redirect("/campgrounds");
});

//show more info about campground
router.get("/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(foundcampground);
            res.render("campgrounds/show",{campground:foundcampground});         
        }
    }); 
    
});
//req is request and res is response

//EDIT campground route
router.get("/:id/edit", middleware.checkcampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, foundcampground){
        res.render("campgrounds/edit", {campground: foundcampground});     
    });
        
});

//UPDATE campground route
router.put("/:id", middleware.checkcampgroundOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedcampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

//Destroy Campground
router.delete("/:id", middleware.checkcampgroundOwnership, function(req, res){
    //res.send("delete");
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    })
});

module.exports= router;