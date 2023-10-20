const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    surname: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    phone:{
      type: Number
    },
    openTickets: [{
      type: Schema.Types.ObjectId,
      ref: 'Repair'
    }],
    closedTickets: [{
      type: Schema.Types.ObjectId,
      ref: 'Repair'
    }],
    posts: [{
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }],
    admin:{
      type: Boolean
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
