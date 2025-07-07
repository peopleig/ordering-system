const { Router, urlencoded } = require("express");
const router = Router();
const express = require("express");
const pool = require("../db.js");
const jwt_verify = require("../middleware/jwtoken.js");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../public/images"));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.floor(Math.random() * 1E4);
        const ext = path.extname(file.originalname);
        const filename = file.fieldname + "-" + uniqueSuffix + ext;
        cb(null, filename);
    }
});
const upload = multer({ storage: storage });

router.get("/", jwt_verify, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).render("error_403");
        }
        const dish_added = req.query.dish_added === "true";
        const category_added = req.query.category_added === "true";
        const [orders] = await pool.query(`
            SELECT order_id, user_id, instructions, order_type, table_number, status, total_cost
            FROM Orders
            ORDER BY order_id DESC
        `);
        const [approvals] = await pool.query(`SELECT user_id, first_name, last_name, role 
            FROM User 
            WHERE approved = false`);
        res.render("admin", { orders, approvals, dish_added, category_added });
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/add_dish", jwt_verify, async (req,res)=> {
    try{
        if (req.user.role !== "admin"){
            return res.status(403).render("error_403");
        }
        const [categories] = await pool.query("SELECT * FROM Categories");
        res.render("add_dish", {categories});
    }
    catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/add_dish", jwt_verify, upload.single("item_image"), async (req, res) => {
    try {
        if(req.user.role !== "admin"){
            return res.status(403).render("error_403");
        }
        const {item_name, category_id, price, description, is_veg, spice_level} = req.body;
        const image_url = "/images/" + req.file.filename;
        await pool.query(
            `INSERT INTO Items (item_name, category_id, price, description, item_image_url, is_veg, spice_level)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [item_name, category_id, price, description, image_url, is_veg, spice_level]
        );
        res.redirect("/admin?dish_added=true");
    } catch (err) {
        console.error("Error adding dish:", err);
        res.status(500).send("Error adding dish.");
    }
});

router.get("/add_category", jwt_verify, async(req,res) => {
    try{
        if(req.user.role !== "admin"){
            return res.status(403).render("error_403");
        }
        res.render("add_category");
    }catch(err) {
        console.error("Error adding category:", err);
        res.status(500).send("Error adding category");
    }
});

router.post("/add_category", jwt_verify, async(req,res) => {
    try{
        if(req.user.role !== "admin"){
            return res.status(403).render("error_403");
        }
        await pool.query(
            `INSERT INTO Categories (category_name)
             VALUES (?)`,
            [req.body.category_name]
        );
        res.redirect("/admin?category_added=true");
    }catch(err) {
        console.error("Error adding category:", err);
        res.status(500).send("Error adding category");
    }
});

router.patch("/approve/:user_id", async (req, res) => {
    try{
        await pool.query("UPDATE User SET approved = true WHERE user_id = ?", [req.params.user_id]);
        res.sendStatus(200);
    }
    catch(err) {
        console.error("Error Approving User:", err);
        res.sendStatus(500);
    }
});

router.delete("/delete/:user_id", async (req, res) => {
    try{
        await pool.query("DELETE FROM User WHERE user_id = ?", [req.params.user_id]);
        res.sendStatus(200);
    }
    catch(err) {
        console.error("Error Deleting User:", err);
        res.sendStatus(500);
    }
});


module.exports = router;