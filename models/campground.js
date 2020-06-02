var mongoose=require("mongoose");

//set up schema
var campgroundschema=new mongoose.Schema({
    name: String,
    image: String,
    price: String,
    description: String,//comments is the array of object ids
    author: {
        id: { //id is reference to user model
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"//ref is name of model
        }
    ]
});
//variable to access database
var Campground= mongoose.model("Campground", campgroundschema);

module.exports= Campground;