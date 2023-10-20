const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const axios = require('axios');
const app = express();
const mongoose = require('mongoose');
const User = require("../models/User.model");
require('dotenv').config();

const mKey= process.env.MOUSERKEY
const gKey= process.env.MAP_API


app.use(bodyParser.urlencoded({ extended: true }));

/* GET home page */
router.get("/", (req, res, next) => {

  if (req.session.currentUser) {
    const { username, password } = req.session.currentUser;
    //console.log('USERNAME: ', username, 'PASSWORD: ', password);
    User.findOne({ username }).then((user) => {
      if (password===user.password) {
        res.render("index", { gKey, user,userInSession: req.session.currentUser });
      } 
    });
  } else {


  res.render("index",{gKey} );}
});

router.get("/prices", (req, res, next) => {

  if (req.session.currentUser) {
    const { username, password } = req.session.currentUser;
    User.findOne({ username }).then((user) => {
      if (password===user.password) {
       
          res.render("prices", {gKey,  user  ,userInSession: req.session.currentUser});
      } 
    });
  }else{

    res.render("prices", {gKey});
  }
  
 
});

router.get("/projects", (req, res, next) => {
  res.render("projects");
})

router.get("/about", (req, res, next) => {
  res.render("about");
})


router.get("/about", (req, res, next) => {

  if (req.session.currentUser) {
    const { username, password } = req.session.currentUser;
    User.findOne({ username }).then((user) => {
      if (password===user.password) {
       
          res.render("about", {gKey,  user  ,userInSession: req.session.currentUser});
      } 
    });
  }
  else{
    res.render("about", {gKey});
  }
  
});

router.post("/componentsearch", async (req, res) => {
  const searchTerms = req.body.component; // retrieve search terms from the request body

  const endpoint = `https://api.mouser.com/api/v1/search/keyword?apiKey=${mKey}`;
  const options =  {
      SearchByKeywordRequest: {
        keyword: searchTerms,
        records: 40,
        startingRecord: 0,
        searchOptions: '',
        searchWithYourSignUpLanguage: '',
    },
  };

  try {
    const response = await axios.post(endpoint, options);
    const data = response.data; // parse the JSON response
   
    
    res.render("csr", {result: data.SearchResults.Parts, caseId: req.body.caseId} );
  } catch (error) {
    console.log(error);
    res.render("csr", {
      errorMessage: "An error occurred while searching for components.",
    });
  } 
});


module.exports = router;
