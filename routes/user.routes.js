const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Repair = require("../models/Repair.model");
const User = require("../models/User.model");
const Admin = require('../models/Admin.model');



const gKey= process.env.MAP_API;
const mail= process.env.MAIL;
const passwordMail= process.env.PASSWORDMAIL;

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
  const { name, email, message, phone,subject  } = req.body;

  // Send email using nodemailer
  const transporter = nodemailer.createTransport({
    host: 'smtp.goneo.de',
    port: 465,
    secure: true, 
    auth: {
        user: mail,
        pass: 'R3qu3sts1!'
    }
});
  const mailOptions = {
      from: `${mail}`,
      to: `${mail}`,
      subject: 'New Request',
      text: `Name: ${name}\nPhone: ${phone}\nSubject: ${subject}\nEmail: ${email}\nMessage: ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
      } else {
          console.log('Email sent: ' + info.response);
          res.send('Form submitted successfully!');
      }
    })

});



module.exports = router;