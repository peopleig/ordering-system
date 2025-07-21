const express = require('express');
const router = express.Router();
const already_logged_in = require("../middleware/blockaccess.js");
const pool = require("../db.js");
const hash_pwd  = require('../password.js');
const {user_exists, send_mail} = require("../middleware/resetauth.js");

router.get('/', already_logged_in, (req,res) => {
    const error = req.query.error;
    res.render('forgot_pwd', {error, message: ""});
});

router.post('/', already_logged_in, user_exists, async(req,res) => {
    const user = req.user;
    try {
        const otp = Math.floor(100000 + Math.random() * 900000);
        await pool.query(
            `INSERT INTO Otp (user_id, otp, created_at, random_string)
            VALUES (?,?,?,?)`, [user.user_id, otp, Date.now(), 'a']
        );
        send_mail(user.email_id, otp, "Password Reset");
        const user_id = user.user_id;
        res.redirect(`/reset/verify_otp?user_id=${user_id}`);
    }
    catch(err){
        console.error("Error in OTP Gen: ",err);
    }
});

router.get('/verify_otp', already_logged_in, async(req,res) => {
    const user_id = parseInt(req.query.user_id);
    try{
        res.render('verify_otp', {user_id, error: false, message:""});
    }
    catch(err){
        console.error('Err in Verify OTP Page: ', err);
    }
});

router.post('/verify_otp/:user_id', already_logged_in, async(req,res) =>{
    const user_id = parseInt(req.params.user_id);
    const otp = parseInt(req.body.otp);
    try{
        const [otps] = await pool.query(`SELECT * FROM Otp WHERE user_id = ? ORDER BY created_at DESC`, [user_id]);
        if(otps.length === 0){
            return res.render('forgot_pwd', {error: true, message: "No OTP in Database!"});
        };
        const check_otp = otps[0];
        if(Date.now() - check_otp.created_at > 600000){
            return res.render('forgot_pwd', {error: true, message: "OTP Expired! Only 10 minute validity"});
        }
        if(check_otp.otp !== otp){
            return res.render('verify_otp', {user_id, error: true, message: "Incorrect OTP! Try that again"});
        }
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
        let random_string = '';
        let i = 20;
        while(i--){
            random_string += characters[Math.floor(Math.random()*characters.length)];
        }
        await pool.query(`UPDATE Otp SET random_string = ? WHERE user_id = ?`, [random_string, user_id]);
        res.redirect(`/reset/reset_pwd/${user_id}?random=${random_string}`);
    }
    catch(err){
        console.error("Error Verifying OTP: ", err);
    }
});
router.delete('/verify_otp/:user_id', already_logged_in, async(req,res) =>{
    const user_id = parseInt(req.params.user_id);
    try{
        await pool.query (`DELETE FROM Otp WHERE user_id = ?`, [user_id]);
        res.redirect('/login');
    }
    catch(err){}
});

router.get('/reset_pwd/:user_id', already_logged_in, async(req,res) => {
    const user_id = parseInt(req.params.user_id);
    const random_string = req.query.random;
    try{
        res.render('reset_pwd', {user_id, random_string});
    }
    catch(err){
        console.error('Reset Page Loading Error: ', err);
    }
});

router.post('/reset_pwd/:user_id', already_logged_in, async(req,res) =>{
    const user_id = parseInt(req.params.user_id);
    const random_string = req.body.random;
    const password = req.body.password;
    try{
        const [otps] = await pool.query(`SELECT random_string FROM Otp WHERE user_id = ? ORDER BY created_at DESC`, [user_id]);
        if(otps.length === 0){
            return res.render('forgot_pwd', {error: true, message: "No OTP Found in Database!"});
        }
        const otp = otps[0];
        if(otp.random_string !== random_string){
            return res.render('login', {error: true, message: "Can't do that mate. Good try though!"});
        }
        const [users] = await pool.query(`SELECT * FROM User WHERE user_id = ?`, [user_id]);
        if(users.length === 0){
            return res.redirect('/login');
        }
        await pool.query(`DELETE FROM Otp WHERE user_id = ?`, [user_id]);
        const user = users[0];
        const hashedPassword = await hash_pwd(password);
        await pool.query(`UPDATE User SET password = ? WHERE user_id = ?`,[hashedPassword, user_id]);
       return res.redirect("/login?error=true&message=Password Reset Successful");
    }
    catch(err){}
})

router.use((req, res) => {
    res.status(404).render('error_404');
});

module.exports = router;