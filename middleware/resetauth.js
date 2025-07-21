const pool = require("../db");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

async function user_exists(req, res, next) {
    const { reset_type, identifier } = req.body;
    try {
        let query;
        if(reset_type === "email"){
            query = "SELECT * FROM User WHERE email_id = ?";
        }
        else {
            console.log("Don't have that feature");
            return res.render("login", {error: true, message: "Sorry! Feature for OTP via SMS is not built yet"});
            // query = "SELECT * FROM User WHERE mobile_number = ?";
            //Feature Will be Updated
        }
        const [users] = await pool.query(query, [identifier]);
        if (users.length === 0) {
            return res.status(401).render("forgot_pwd", { error: true, message: "Invalid Credentials! No Such User Found!" });
        }
        const user = users[0];
        req.user = user; 
        next();
    } catch (err) {
        res.status(500).render("error_404", { message: "Internal server error." });
    }
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function send_mail (to, otp, reason, time) {
    try {
        const info = await transporter.sendMail({
            from: '"Neptune\'s Kitchen" <neptune17.blue@gmail.com>',
            to: to,
            subject: `Your ${reason} OTP`,
            text: `Your OTP: ${otp}\nIt Expires in 10 minutes\nYou have till: ${time}`,

        });
        console.log("Sent:", info.response);
    }
    catch(err){
        console.error("Error in sending mail:", err);
    }
}

module.exports = {user_exists, send_mail} ;