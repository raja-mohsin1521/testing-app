const express = require("express");
const {
    getStatistics

} = require("../../Controller/Admin/adminHomeController");

const router = express.Router();

router.get("/readall", getStatistics);              
  

module.exports = router;
