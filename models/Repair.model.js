const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const repairSchema = new Schema(
  {

    user: {  type: Schema.Types.ObjectId, ref: 'User' },

    productName: {
      type: String,
      required: true,
    },
    brand: {
        type: String,
        required: true,
      },
    urgency:{ //  type: Number(1 low, 2 normal, 3 high)
   type:Number
    },
    description:{
      type:String
    },
    droppOffDate:{
        type: Date,
    },
    pickUpDate:{
        type: Date,
    },
    calculatedPrice:{
        type:Number
    },
    totalPrice:{
        type:Number
    },
    hours:{
        type:Number
    },
    status:{ // (0 waiting approval, 1 accepted , 2 delivered, 3 working on 4 ready 5 more info needed // 6 closed (paid and everything))
        type:Number
    },
    componentRequired:{
      type:Array
    },
    componentUsed:{//push an array of objects here, so the object can have already the price, name and all the information in the object, it will be easy to iterate in a table later
      type:Array
    },
    comments:{
      type:Array
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Repair = model("Repair", repairSchema);

module.exports = Repair;
