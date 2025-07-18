const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const jwt_verify = require("../middleware/jwtoken.js");

router.get("/", jwt_verify, async(req,res) =>{
    const {user_id, role} = req.user;
    try {
        const review_exists = req.query.review_exists === "true";
        const [rows] = await pool.query(`
            SELECT i.item_id, i.item_name, i.description, i.price, i.item_image_url, i.spice_level, i.is_veg,c.category_name
            FROM Items i
            JOIN Categories c ON i.category_id = c.category_id
            ORDER BY c.category_name, i.item_name`);

        const menu_by_category = {};

        for (const item of rows) {
            const category = item.category_name;
            if (!menu_by_category[category]) {
                menu_by_category[category] = [];
            }
        
            menu_by_category[category].push({
                item_id: item.item_id,
                item_name: item.item_name,
                description: item.description,
                price: item.price,
                image: item.item_image_url,
                spice_level: item.spice_level,
                is_veg: item.is_veg === 1
            });
            
        }
        const user_id = req.user.user_id;
        const [orders] = await pool.query(`
            SELECT order_id, total_cost, status
            FROM Orders
            WHERE user_id = ?
            ORDER BY order_id DESC
        `, [user_id]);

        res.render("menu", { menu_by_category , orders, review_exists, role});

    } catch (err) {
        console.error("Error loading menu:", err);
        res.status(500).send("Internal Server Error");
    }
});
router.post("/", jwt_verify, async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const cart = JSON.parse(req.body.cart_data);
        const order_type = req.body.order_type;
        const table_number = parseInt(req.body.table_number) || 0;
        const instructions = req.body.instructions || "";
        const total_cost = parseFloat(req.body.total_cost) || 0;

        const [order_result] = await pool.query(`
            INSERT INTO Orders (user_id, order_type, status, table_number, instructions, total_cost)
            VALUES (?, ?, 'preparing', ?, ?, ?)`,
            [user_id, order_type, table_number, instructions, total_cost]
        );
        const order_id = order_result.insertId;
        const values = cart.map(item => [order_id, item.id, item.quantity, item.instruction]);
        const final_items = await pool.query("INSERT INTO Ordered_Items (order_id, item_id, quantity, specific_instructions) VALUES ?", [values]);
        console.log(final_items);
        res.redirect("/order");
    } catch (err) {
        console.error("Order submission error:", err);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/:order_id", jwt_verify, async (req, res) => {
    const { user_id, role } = req.user;
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
        if (order.status !== "payment_pending"){
            return res.status(404).render("error_404");
        }
        if (order.user_id !== user_id) {
            return res.status(403).render("error_403");
        }
        const [users] = await pool.query(
            "SELECT first_name, last_name, reward_points, last_visited FROM User WHERE user_id = ?",
            [order.user_id]
        ); 
        const user = users[0];
        const last_visited = new Date(user.last_visited);
        const six_months_ago = new Date();
        six_months_ago.setMonth(six_months_ago.getMonth() - 6);
        if (last_visited < six_months_ago && user.reward_points > 0) {
            await pool.query(
                "UPDATE User SET reward_points = 0 WHERE user_id = ?",
                [order.user_id]
            );
            user.reward_points = 0;
        }
        const [items] = await pool.query(
            "SELECT i.item_name,i.price,oi.quantity FROM Ordered_Items oi JOIN Items i ON oi.item_id = i.item_id WHERE oi.order_id = ?",
            [order.order_id]
        );
        let total = 0;
        items.forEach(item =>{
            total+= item.price*item.quantity;
        });
        res.render("bill", { order, user, items, total });
    } catch (err) {
        console.error("Error fetching order:", err);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/preparing/:order_id", jwt_verify, async (req,res) => {
    const { user_id, role } = req.user;
    const order_id = parseInt(req.params.order_id);
    try{
        const [orders] = await pool.query(
            "SELECT * FROM Orders WHERE order_id = ?",
            [order_id]
        );
        if (orders.length === 0) {
            return res.status(404).render("error_404");
        }
        const order = orders[0];
        if (order.user_id !== user_id && role !== "admin") {
            return res.status(403).render("error_403");
        }
        if (order.status === "completed"){
            return res.status(404).render("error_404");
        }
        if (order.status === "payment_pending" && role !== "admin"){
            return res.status(403).render("error_403");
        }
        const [users] = await pool.query(
            "SELECT first_name, last_name FROM User WHERE user_id = ?",
            [order.user_id]
        ); 
        const user = users[0];
        const [items] = await pool.query(
            "SELECT i.item_name,i.price,oi.quantity FROM Ordered_Items oi JOIN Items i ON oi.item_id = i.item_id WHERE oi.order_id = ?",
            [order.order_id]
        );
        let total = 0;
        items.forEach(item =>{
            total+= item.price*item.quantity;
        });
        res.render("bill_prep", { order, user, items, total, role });
    }
    catch(err){
        console.error("Error fetching order:", err);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/completed/:order_id", jwt_verify, async (req,res) => {
    const { user_id, role } = req.user;
    const order_id = parseInt(req.params.order_id);
    try{
        const [orders] = await pool.query(
            "SELECT * FROM Orders WHERE order_id = ?",
            [order_id]
        );
        if (orders.length === 0) {
            return res.status(404).render("error_404");
        }
        const order = orders[0];
        if (order.user_id !== user_id && role !== "admin") {
            return res.status(403).render("error_403");
        }
        if (order.status !== "completed"){
            return res.status(404).render("error_404");
        }
        const [users] = await pool.query(
            "SELECT * FROM User WHERE user_id = ?",
            [order.user_id]
        ); 
        const user = users[0];
        const [items] = await pool.query(
            "SELECT i.item_name,i.price,oi.quantity FROM Ordered_Items oi JOIN Items i ON oi.item_id = i.item_id WHERE oi.order_id = ?",
            [order.order_id]
        );
        const total = order.total_cost;
        const [transactions] = await pool.query(
            "SELECT * FROM Payment WHERE order_id = ?",
            [order_id]
        );
        const transaction = transactions[0];
        const [reviews] = await pool.query(
            "SELECT * FROM Reviews WHERE order_id = ?",
            [order_id]
        );
        const review = reviews[0];
        res.render("bill_complete", { order, user, items, total, transaction, review, role});
    }
    catch(err){
        console.error("Error fetching order:", err);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/:order_id", jwt_verify, async(req,res)=> {
    const { user_id, role } = req.user;
    const order_id = parseInt(req.params.order_id);
    const used_points = parseInt(req.body.used_points) || 0;
    const tip = parseFloat(req.body.tip) || 0;

    try {
        const [order_res] = await pool.query("SELECT total_cost FROM Orders WHERE order_id = ?", [order_id]);
        if (order_res.length === 0){
            return res.status(404).render("error_404");
        }
        const order_total = order_res[0].total_cost;
        const final_amount = Math.max(order_total + tip - used_points, 0);
        await pool.query(
            `INSERT INTO Payment (order_id, tip_amount, discount_reward_points, amount_paid, payment_status)
            VALUES (?, ?, ?, ?, 'paid')`,
            [order_id, tip, used_points, final_amount]
        );
        await pool.query(
            `UPDATE User SET reward_points = reward_points - ? WHERE user_id = ?`,
            [used_points, user_id]
        );
        const new_points = Math.floor(order_total * 0.10);
        await pool.query(
            `UPDATE User 
             SET reward_points = reward_points + ?, 
                 last_visited = CURRENT_DATE() 
             WHERE user_id = ?`,
            [new_points, user_id]
        );
        await pool.query(
            `UPDATE Orders SET status = 'completed' WHERE order_id = ?`,
            [order_id]
        );
        const reward_points = await pool.query("SELECT reward_points FROM User WHERE user_id = ?", [user_id]);
        res.redirect(`/review/${order_id}`);
    } catch (err) {
        console.error("Payment error:", err);
        res.status(500).send("Payment Failed");
    }
});

module.exports = router;