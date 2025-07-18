const { Router, urlencoded } = require("express");
const router = Router();
const express = require("express");
const pool = require("../db.js");
const jwt_verify = require("../middleware/jwtoken.js");

router.get("/", jwt_verify, async (req,res)=>{
    const { user_id, role } = req.user;
    try{
        if(role !== "chef"){
            return res.status(403).render("error_403");
        }
        const [items] = await pool.query(
            `SELECT i.item_name, c.category_name, oi.quantity, oi.specific_instructions, o.instructions, o.order_id, oi.chef_id, u.first_name, u.last_name
             FROM Ordered_Items oi
             JOIN Items i ON oi.item_id = i.item_id
             JOIN Categories c ON i.category_id = c.category_id
             JOIN Orders o ON oi.order_id = o.order_id
             LEFT JOIN User u ON oi.chef_id = u.user_id
             WHERE o.status = 'preparing' AND oi.dish_complete = FALSE
             ORDER BY o.order_id ASC`
        );

        res.render("chef", { items, user_id });
    } 
    catch(err){
        console.error("Error for chef page:", err);
        res.status(500).send("Internal Server Error");
    }
});
router.post("/assign", jwt_verify, async (req, res) => {
    const { user_id } = req.user;
    const { order_id, item_name } = req.body;

    try {
        if(req.user.role !== "chef"){
            return res.status(403).render("error_403");
        }
        const [check] = await pool.query(
            `SELECT * FROM Ordered_Items oi
             JOIN Items i ON oi.item_id = i.item_id
             WHERE oi.order_id = ? AND i.item_name = ? AND oi.chef_id = 1`,
            [order_id, item_name]
        );
        if (check.length === 0) {
            return res.status(403).render("error_403");
        }
        await pool.query(
            `UPDATE Ordered_Items SET chef_id = ? WHERE order_id = ? AND item_id = (
                SELECT item_id FROM Items WHERE item_name = ?
            )`,
            [user_id, order_id, item_name]
        );

        res.redirect("/chef");
    } catch (err) {
        console.error("Assign error:", err);
        res.status(500).send("Error assigning dish");
    }
});

router.post("/complete", jwt_verify, async (req, res) => {
    const { user_id } = req.user;
    const { order_id, item_name } = req.body;

    try {
        if(req.user.role !== "chef"){
            return res.status(403).render("error_403");
        }
        const [check] = await pool.query(
            `SELECT * FROM Ordered_Items oi
             JOIN Items i ON oi.item_id = i.item_id
             WHERE oi.order_id = ? AND i.item_name = ? AND oi.chef_id = ?`,
            [order_id, item_name, user_id]
        );
        if (check.length === 0) {
            return res.status(403).render("error_403");
        }
        await pool.query(
            `UPDATE Ordered_Items SET dish_complete = TRUE
             WHERE order_id = ? AND item_id = (
                SELECT item_id FROM Items WHERE item_name = ?
             )`,
            [order_id, item_name]
        );
        const [update] = await pool.query(
            `SELECT dish_complete FROM Ordered_Items WHERE order_id = ? AND dish_complete = 'false'`, [order_id]);
        if(update.length === 0){
            await pool.query(`UPDATE Orders SET status = 'payment_pending' WHERE order_id = ?`, [order_id]);
        }
        res.redirect("/chef");
    } catch (err) {
        console.error("Complete error:", err);
        res.status(500).send("Error completing dish");
    }
});


module.exports = router;