const { Router, urlencoded } = require("express");
const router = Router();
const express = require("express");
const pool = require("../db.js");


router.get("/", async(req, res) => {
    try{
        res.clearCookie("token");
        res.redirect("/home");
    }
    catch(err){
        console.error("Error logging you out:", err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
