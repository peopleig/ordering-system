const express = require("express");
const { Router, urlencoded } = require("express");
const router = Router();
const pool = require("../db.js");
const jwt = require("jsonwebtoken");
const hash_pwd  = require('../password.js');
const already_logged_in = require("../middleware/blockaccess.js");
const SECRET_KEY = process.env.SECRET_KEY;

router.get('/', already_logged_in, (req,res) => {
    res.render('signup', {error: false, message: ""});
});

router.post("/", async (req, res) => {
    try{
        const { role, first_name, last_name, email, mobile, password } = req.body;
        if (!email && !mobile) {
            return res.render("signup", {
                error: true,
                message: "We need something to reach you — email or mobile!"
            });
        }
        let query0 = `SELECT * FROM User WHERE `;
        let params = [];
        if (email) {
            query0 += `email_id = ?`;
            params.push(email);
        }

        if (mobile) {
            if (email) query0 += ` OR `;
            query0 += `mobile_number = ?`;
            params.push(mobile);
        }
        const [existing] = await pool.query(query0, params);
        if (existing.length > 0) {
            return res.render("signup", {
                error: true,
                message: "OOPS! This Email/Mobile No. is already in use"
            });
        }
        const hashedPassword = await hash_pwd(password);
        const approved = (role === "customer");
        const query = `INSERT INTO User (first_name, last_name, email_id, mobile_number, password, role, approved)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [first_name, last_name, email || null, mobile || null, hashedPassword, role, approved];
        const result = await pool.query(query, values);
        const [newUser] = await pool.query(
            `SELECT user_id FROM User WHERE email_id = ? OR mobile_number = ?`,
            [email || null, mobile || null]
        );
        if (role === "customer" && approved) {
            const token = jwt.sign({ user_id: newUser[0].user_id, role: role }, SECRET_KEY, { expiresIn: "1hr" });
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000
            });
            return res.redirect("/order");
        }
        return res.redirect("/home/approval");
    } 
    catch (err) {
        console.error("Signup error:", err);
        res.status(500).send("Server Error");
    }
});

router.use((req, res) => {
    res.status(404).render('error_404');
});

module.exports = router;