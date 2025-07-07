const express = require('express');
const router = express.Router();
const already_logged_in = require("../middleware/blockaccess.js");

router.get('/', already_logged_in, (req,res) => {
    res.render('home');
});
router.get('/approval', already_logged_in, (req,res) =>{
    res.render('approval');
})
router.use((req, res) => {
    res.status(404).render('error_404');
});

module.exports = router;