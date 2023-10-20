const session = require("express-session");
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

module.exports = (app) => {
  app.set("trust proxy", 1);

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
      cookie: {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24, // 5 * 60 * 1000 ms === 5 min
      },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb+srv://thesynthdoctor:sjJGXqtRpPmTtPF6@thesynthdoctor.qbqgpox.mongodb.net/test' 
        /*   store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 60 * 60 * 24, // 1 day*/
     })  
    })
  );
};

