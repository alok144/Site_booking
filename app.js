var express= require("express"),
    app= express(),
    bodyparser= require("body-parser"),
    mongoose= require("mongoose"),
    passport= require("passport"),
    LocalStrategy= require("passport-local"),
    flash= require("connect-flash"),
    methodOverride= require("method-override"),
    User= require("./models/user"),
    Campground= require("./models/campground"),
    Comment= require("./models/comment"),
    seedDB= require("./seeds");

//requiring routes    
var campgroundRoutes= require("./routes/campgrounds"),
    commentRoutes= require("./routes/comments"),
    authRoutes= require("./routes/index");//index routes
    

//console.log(process.env.DATABASEURL);
    
//mongoose.connect("mongodb://localhost/yelp_camp_deploy");
var url=process.env.DATABASEURL || "mongodb://localhost/yelp_camp_deploy";
mongoose.connect(url);//we set databseurl differently for local mongo and heroku
//mongoose.connect("mongodb+srv://alok:aloksingh@cluster0-bzvzw.mongodb.net/test?retryWrites=true&w=majority");
    
app.use(bodyparser.urlencoded({extended: true})); //to get body of data
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//var path= require("path");
//app.set("views", path.join(__dirname, "views/campgrounds"));

//**************************//

//passport configuration
app.use(require("express-session")({
    secret: "rusty is best",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));
//for reading the session and taking data from session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//**************************//

//middleware to pass currentUser to every route
app.use(function(req, res, next){
    res.locals.currentUser= req.user;
    res.locals.errorflash= req.flash("error");
    res.locals.successflash= req.flash("success");
    next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(authRoutes);

var port=process.env.PORT||8080;
app.set("view engine", "ejs");

//*********** seed the database **********//
//seedDB();


app.listen(port, function(){
    console.log("yelp camp started!!");
}); 