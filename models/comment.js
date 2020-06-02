var mongoose=require("mongoose");

var commentSchema= mongoose.Schema({
        text: String,
        author: {
            id: { //id is reference to user model
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
        }
    });

var comment=mongoose.model("Comment",commentSchema);

module.exports= comment;