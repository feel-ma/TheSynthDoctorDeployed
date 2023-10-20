const mongoose = require("mongoose");
const MONGO_URI = "mongodb://127.0.0.1:27017/theSynthLocal";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((error) => {
    if (error instanceof mongoose.Error) {
      // Handle Mongoose-specific errors
      if (error.name === "MongoTimeoutError") {
        console.error("MongoDB connection timed out.");
      } else {
        console.error("Mongoose error:", error.message);
      }
    } else {
      // Handle generic errors
      console.error("Error connecting to MongoDB:", error.message);
    }
  });

// You can optionally listen for disconnect events
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});

// Handle SIGINT (Ctrl-C) to close the MongoDB connection when the app is terminated
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed due to app termination");
    process.exit(0);
  });
});
