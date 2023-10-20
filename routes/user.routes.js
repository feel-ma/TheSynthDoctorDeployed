const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Repair = require("../models/Repair.model");
const User = require("../models/User.model");
const Admin = require('../models/Admin.model');

const gKey= process.env.MAP_API;

const { isLoggedIn, isLoggedOut, isUser } = require("../middleware/route-guard.js");


//CREATE A REQUEST
router.get('/contact', (req, res) => {
 
  
    if (req.session.currentUser) {
      const { username, password } = req.session.currentUser;
      User.findOne({ username }).then((user) => {
        if (password===user.password) {
         
            res.render("contact", {gKey,  user  ,userInSession: req.session.currentUser});
        } 
      });
    }else{
      res.render('contact', {gKey});
    }
});

let isRouteRunning = false;

router.post('/contact', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  try {
    const admin = await Admin.findOne({ email: "notbatman@batman.not" }); 

    admin.messages.push({ name, email, phone, subject, message });
    await admin.save();

    res.render("contact", { gKey, message: 'Form submitted successfully! The Synth Doctor is on it :)' });
  } 
  catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render("contact", { gKey, errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render("contact", { gKey, errorMessage: "Error. Please try again" });
    }
  }
  isRouteRunning = true;
});



module.exports = router;