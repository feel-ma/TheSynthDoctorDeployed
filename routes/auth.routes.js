const express = require("express");
const router = express.Router();
const db = require("../db/index.js");

const User = require("../models/User.model");
const Admin = require("../models/Admin.model");

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const Repair = require("../models/Repair.model");

const { isLoggedIn, isLoggedOut, isUser } = require("../middleware/route-guard.js");

const gKey = process.env.MAP_API;

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{7,}$/;

router.get("/create", isLoggedOut, (req, res, next) => {
  
  res.render("account-create", { gKey });
});

router.post("/create", async (req, res, next) => {
  const newUser = req.body;
  console.log(newUser);
  if (!newUser.email || !newUser.password || !newUser.name) {
    res.render("account-create", {gKey,
      errorMessage:
        "All fields are mandatory. Please provide your name, email and password.",
    });
    return;
  } else if (newUser.email != newUser.email2) {
    res.render("account-create", {gKey,
      errorMessage:
        "The emails you provided are not the same, please check again",
    });
    return;
  } else if (newUser.password != newUser.password2) {
    res.render("account-create", {gKey,
      errorMessage:
        "The Passwords you provided are not the same, please check again",
    });
    return;
  } else if (!passwordRegex.test(newUser.password)) {
    res.render("account-create", {gKey,
      errorMessage:
        "The Passwords should contain at least 1 capital letter, 1 number and be minimum 7 characters long",
    });
    return;
  } else if (!emailRegex.test(newUser.email)) {
    res.render("account-create", {gKey,
      errorMessage: "The Email you provided is invalid, please check again",
    });
    return;
  }
  try {
    const pw = bcrypt.hashSync(newUser.password, salt);
    newUser.password = pw;
    await User.create({
      name: newUser.name,
      surname: newUser.surname,
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      //admin:true
    });
    // req.session.userId = newUser._id;
    res.render("login", { gKey });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render("account-create", {gKey, errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render("account-create", {gKey,
        errorMessage: "This username already exists",
      });
    } else {
      next(error);
    }
  }
});

router.get("/login", isLoggedOut, (req, res) => {
  console.log("SESSION LOGIN: ", req.session);

  if (req.session.currentUser) {
    const { username, password } = req.session.currentUser;
    //console.log('USERNAME: ', username, 'PASSWORD: ', password);
    User.findOne({ username }).then((user) => {
      if (password === user.password) {
        res.render("user-profile", {
          gKey,
          user,
          userInSession: req.session.currentUser,
        });
      } else {
        res.render("login", { gKey, errorMessage: "Incorrect password." });
      }
    });
  } else {
    res.render("login", { gKey });
  }
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  console.log("SESSION =====> ", req.session);

  if (!username || !password) {
    res.render("login", {
      gKey,
      errorMessage: "Please enter both, username and password to login.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("login", {
          gKey,
          errorMessage: "Username is not registered. Try with other username.",
        });
        return;
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/user-profile");
      } else {
        res.render("login", { gKey, errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

router.get("/user-profile", isUser, async (req, res, next) => {
  try {
    const userId = req.session.currentUser._id;
    const repairs = await Repair.find({ user: userId });
    const user = { ...req.session.currentUser, openTickets: repairs };
    res.render("user-profile", { gKey, userInSession: user });
  } catch (error) {
    console.log(`Error while retrieving user profile: ${error}`);
    next(error);
  }
});

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

router.get("/repair", (req, res) => {
  res.render("success", { gKey, userInSession: req.session.currentUser });
});

router.post("/repair", async (req, res) => {
  try {
    const newRepair = req.body;
    console.log(newRepair);
    await Repair.create(newRepair);
    res.render("success", {gKey, repairMessage: "Form submitted successfully!" , userInSession: req.session.currentUser});
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
