const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.render('home');
});
router.get('/approval',(req,res) =>{
    res.render('approval');
})
router.use((req, res) => {
    res.status(404).render('error_404');
});

module.exports = router;