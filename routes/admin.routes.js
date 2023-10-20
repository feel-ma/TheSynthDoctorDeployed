const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Repair = require("../models/Repair.model");

const { isLoggedIn, isLoggedOut,isAdmin } = require("../middleware/route-guard.js");

function calculateHoursAndMinutes(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return { hours, minutes };
}

/* GET home page */
router.get("/", isAdmin,  (req, res, next) => {
  res.render("admin");
});

router.get("/projects",  isAdmin, (req, res, next) => {
  const pending = [];
  const active = [];
  const closed = [];

  Repair.find().then((result) => {
    for (one of result) {
      if (one.status === 0 || one.status == 1 || one.status == 5)
        pending.push(one);
      else if (one.status == 2 || one.status == 3) active.push(one);
      else if (one.status == 4) closed.push(one);
    }
    res.render("admin-projects", { pending, active, closed });
  });
});

router.post("/projects", (req, res, next) => {

  if(req.body.caseIdPending){
    Repair.findByIdAndUpdate(req.body.caseIdPending,  { status: 2 }).then(()=>{
      return
    })
  }
  if(req.body.caseIdWorking){
    Repair.findByIdAndUpdate(req.body.caseIdWorking,  { status: 4 }).then(()=>{
      return
    })
  }
  const pending = [];
  const active = [];
  const closed = [];

  Repair.find().then((result) => {
    for (one of result) {
      if (one.status === 0 || one.status == 1 || one.status == 5 || one.status == 4)
        pending.push(one);
      else if (one.status == 2 || one.status == 3) active.push(one);
      else if (one.status == 6) closed.push(one);
    }
    res.render("admin-projects", { pending, active, closed });
  });
});

router.get("/projects/workingOn",  isAdmin, (req, res, next) => {
  res.render("admin-workingON");
});

router.post("/projects/workingOn", async (req, res, next) => {

  if (req.body.hours || req.body.minutes || req.body.seconds) {
    const hours = parseInt(req.body.hours) || 0;
    const minutes = parseInt(req.body.minutes) || 0;
    const seconds = parseInt(req.body.seconds) || 0;
  
    Repair.findById(req.body.caseId)
      .then((work) => {
        // Retrieve the existing hours value from the database
        const existingHours = work.hours || 0;
  
        // Convert hours, minutes, and seconds to seconds
        const newTotalSeconds = hours * 3600 + minutes * 60 + seconds;
  
        // Add the existing hours value to the new hours value
        const totalSeconds = existingHours + newTotalSeconds;
  
        // Update the hours value in the database
        return Repair.findByIdAndUpdate(req.body.caseId, { hours: totalSeconds });
      })
      .then(() => {
        // Fetch the updated case and calculate the totals
        return Repair.findById(req.body.caseId);
      })
      .then((work) => {
        let totalUsed = 0;
        let totalRequired = 0;
        let totalTotal = 0;
        const priceH = 60;
        const priceM = 1;
  
        for (part of work.componentRequired) {
          totalRequired += part.total;
        }
  
        for (part of work.componentUsed) {
          totalUsed += part.total;
        }
        const hours = Math.floor(work.hours / 3600);
        const minutes = Math.floor((work.hours % 3600) / 60);
  
        totalTotal = totalRequired + totalUsed +( hours * priceH + minutes * priceM);
  
        res.render("admin-workingON", { work, totalRequired, totalUsed, totalTotal });
      })
      .catch((error) => {
        // Handle any errors that occur during the process
        console.error(error);
      });
  }
  
  if(req.body.caseIdPending){
    Repair.findByIdAndUpdate(req.body.caseIdPending,  { status: 2 }).then(()=>{
      Repair.findById(req.body.caseIdPending).then((work) => {
        let totalUsed=0 
        let totalRequired=0
        let totalTotal=0
      
  
        for(part of work.componentRequired){
          totalRequired+=part.total
        }
  
        for(part of work.componentUsed){
          totalUsed+=part.total
        }
  
        // Extract hours and minutes from work.hours
  const { hours, minutes } = calculateHoursAndMinutes(work.hours);
  const priceH=60
  const priceM=60

  // Calculate the total money
  totalTotal = totalRequired + totalUsed + hours * priceH + minutes * priceM;

  
  
  
        res.render("admin-workingON", { work, totalRequired, totalUsed , totalTotal });
      });
    })
  }
  if(req.body.caseIdWorking){
    Repair.findByIdAndUpdate(req.body.caseIdWorking,  { status: 6 }).then(()=>{
      Repair.findById(req.body.caseIdWorking).then((work) => {
        let totalUsed=0 
        let totalRequired=0
        let totalTotal=0
        
  
        for(part of work.componentRequired){
          totalRequired+=part.total
        }
  
        for(part of work.componentUsed){
          totalUsed+=part.total
        }
  
        const { hours, minutes } = calculateHoursAndMinutes(work.hours);
  const priceH=60
  const priceM=1

  // Calculate the total money
  totalTotal = totalRequired + totalUsed + hours * priceH + minutes * priceM;

  
  
        res.render("admin-workingON", { work, totalRequired, totalUsed , totalTotal });
      });
    })
  }

    if(req.body.caseIdUser){
      Repair.findByIdAndUpdate(req.body.caseIdUser,  { status: 5 }).then(()=>{
        Repair.findById(req.body.caseIdUser).then((work) => {
          let totalUsed=0 
          let totalRequired=0
          let totalTotal=0
          
    
          for(part of work.componentRequired){
            totalRequired+=part.total
          }
    
          for(part of work.componentUsed){
            totalUsed+=part.total
          }
    
          const { hours, minutes } = calculateHoursAndMinutes(work.hours);
  const priceH=60
  const priceM=1

  // Calculate the total money
  totalTotal = totalRequired + totalUsed + hours * priceH + minutes * priceM;

    
    
    
          res.render("admin-workingON", { work, totalRequired, totalUsed , totalTotal });
        });
      })
    }

    if(req.body.caseIdFinish){
      Repair.findByIdAndUpdate(req.body.caseIdFinish,  { status: 4 }).then(()=>{
        Repair.findById(req.body.caseIdFinish).then((work) => {
          let totalUsed=0 
          let totalRequired=0
          let totalTotal=0
          
    
          for(part of work.componentRequired){
            totalRequired+=part.total
          }
    
          for(part of work.componentUsed){
            totalUsed+=part.total
          }
    
          const { hours, minutes } = calculateHoursAndMinutes(work.hours);
  const priceH=60
  const priceM=1

  // Calculate the total money
  totalTotal = totalRequired + totalUsed + hours * priceH + minutes * priceM;

    
    
          res.render("admin-workingON", { work, totalRequired, totalUsed , totalTotal });
        });
      })
    }



  if (req.body.newComment) {
    const existingRepair = await Repair.findById(req.body.caseId);
    existingRepair.comments.push(req.body.newComment);
    await existingRepair.save();
  }

  if (req.body.caseIdP) {
    let c = req.body.count;
    let p = req.body.pr;
    p= p.substring(0, p.length-1)
    p=p.replace(',', '.')
    const parsedValue = parseFloat(p);
    let result = p * c;

    const existingRepair = await Repair.findById(req.body.caseIdP);
    const newPart = {
      name: req.body.pn,
      manu: req.body.ma,
      price: req.body.pr,
      count: req.body.count,
      total: result
    };

    existingRepair.componentUsed.push(newPart);
    await existingRepair.save();

    Repair.findById(req.body.caseIdP).then((work) => {
      res.render("admin-workingON", { work });
    });
  }

  if (req.body.caseIdPR) {
    let c = req.body.count;
    let p = req.body.pr;
    p= p.substring(0, p.length-1)
    p=p.replace(',', '.')
    const parsedValue = parseFloat(p);
    let result = p * c;

    const existingRepair = await Repair.findById(req.body.caseIdPR);
    const newPart = {
      name: req.body.pn,
      manu: req.body.ma,
      price: req.body.pr,
      count: req.body.count,
      total: result
    };

    existingRepair.componentRequired.push(newPart);
    await existingRepair.save();

    Repair.findById(req.body.caseIdPR).then((work) => {
      res.render("admin-workingON", { work });
    });
  }

  if (req.body.caseId) {
    Repair.findById(req.body.caseId).then((work) => {
      let totalUsed = 0;
        let totalRequired = 0;
        let totalTotal = 0;
       
  
        for (part of work.componentRequired) {
          totalRequired += part.total;
        }
  
        for (part of work.componentUsed) {
          totalUsed += part.total;
        }
        const { hours, minutes } = calculateHoursAndMinutes(work.hours);
        const priceH=60
        const priceM=1
      
        // Calculate the total money
        totalTotal = totalRequired + totalUsed + hours * priceH + minutes * priceM;
      
  
        res.render("admin-workingON", { work, totalRequired, totalUsed, totalTotal });
    });
  }

 
});

module.exports = router;

