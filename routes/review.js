const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const jwt_verify = require("../middleware/jwtoken.js");

router.get("/:order_id", jwt_verify, async(req,res) =>{
    const {user_id, role} = req.user;
    const order_id = parseInt(req.params.order_id);
    try {

        const [orders] = await pool.query(
            "SELECT * FROM Orders WHERE order_id = ?",
            [order_id]
        );
        if (orders.length === 0) {
            return res.status(404).render("error_404");
        }
        const order = orders[0];
        if (order.user_id !== user_id || order.status !== "completed") {
            return res.status(403).render("error_403");
        }
        const [users] = await pool.query(
            "SELECT first_name, last_name FROM User WHERE user_id = ?",
            [order.user_id]
        ); 
        const user = users[0];
        res.render("review", {order, user});
    }
    catch(err){
        console.error("Error fetching order:", err);
        res.status(500).send("Internal Server Error");
    }
});
router.post("/:order_id", jwt_verify, async (req, res) => {
    const order_id = parseInt(req.params.order_id);
    const { ambience, food_quality, service, value, comments } = req.body;

    const ambience_rating = parseInt(ambience);
    const food_rating = parseInt(food_quality);
    const service_rating = parseInt(service);
    const value_rating = parseInt(value);

    const star_rating = ((ambience_rating + food_rating + service_rating + value_rating) / 4).toFixed(1);

    try {
        const [instance] = await pool.query ( `SELECT * FROM Reviews WHERE order_id = ?`, [order_id]);
        if (instance.length > 0) {
            return res.redirect("/order?review_exists=true");
        }
        await pool.query(
            `INSERT INTO Reviews (
                order_id, comments, ambience_stars, food_quality_stars, service_stars, value_for_money_stars, star_rating
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [order_id, comments, ambience_rating, food_rating, service_rating, value_rating, star_rating]
        );
        res.redirect("/order");
    } catch (err) {
        console.error("Review insert error:", err);
        res.status(500).send("Could not submit review.");
    }
});
module.exports = router;