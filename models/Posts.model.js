const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const postSchema = new Schema(
  {
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      text:{
        type:String
      },
      stars:{ // used for review system
        type:Number
      }

  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Post = model("Post", postSchema);

module.exports = Post;
