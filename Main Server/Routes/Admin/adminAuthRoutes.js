

const express = require("express");
const {
    updateAdminPassword,
    verifyAdminLogin,


} = require("../../Controller/Admin/adminAuthController");

const router = express.Router();

router.post('/update-password', updateAdminPassword);
router.post('/login', verifyAdminLogin);


module.exports = router;
