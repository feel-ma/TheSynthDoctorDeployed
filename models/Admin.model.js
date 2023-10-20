const { Schema, model } = require("mongoose");

const adminSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: false,
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
    openTickets: [{
        type: Schema.Types.ObjectId,
        ref: 'Repair'
      }],
    closedTickets: [{
        type: Schema.Types.ObjectId,
        ref: 'Repair'
      }],
      messages: [{
        name: String,
        email: String,
        phone: String,
        subject: String,
        message: String
      }]
  },
  
 
);

const Admin = model("Admin", adminSchema);

module.exports = Admin;
