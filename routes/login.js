const express = require("express");
const { Router, urlencoded } = require("express");
const router = Router();
const pool = require("../db.js");
const jwt = require("jsonwebtoken");
const already_logged_in = require("../middleware/blockaccess.js");
const password_match = require("../middleware/loginauth.js");
const SECRET_KEY = process.env.SECRET_KEY;

router.get('/',already_logged_in,(req,res) => {
    res.render('login', {error: false});
});
router.post("/", password_match, async (req, res) => {
    const user = req.user;
    try{
        const [rows] = await pool.query(
            "SELECT approved FROM User WHERE user_id = ?",
            [user.user_id]
        );
        const approved = rows[0]?.approved;
        if (!approved && (user.role === "admin" || user.role === "chef")) {
            return res.redirect("/home/approval");
        }
        const token = jwt.sign( { user_id: user.user_id, role: user.role }, SECRET_KEY, { expiresIn: "1hr" });
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000
        });
        if(user.role === "admin"){
            res.redirect("/admin");
        }
        else if(user.role === "chef"){
            res.redirect("/chef");
        }
        else if(user.role === "customer"){
            res.redirect("/order");
        }
    }
    catch(err) {
        console.error("Login error:", err);
        res.status(500).send("Error logging in");
    }
    
});
router.use((req, res) => {
    res.status(404).render('error_404');
});

module.exports = router;