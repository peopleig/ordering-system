const pool = require("../db");
const bcrypt = require("bcrypt");

async function password_match(req, res, next) {
    const { login_type, identifier, password } = req.body;

    try {
        let query;
        if(login_type === "email"){
            query = "SELECT * FROM User WHERE email_id = ?";
        }
        else {
            query = "SELECT * FROM User WHERE mobile_number = ?";
        }
        const [rows] = await pool.query(query, [identifier]);
        if (rows.length === 0) {
            return res.status(401).render("login", { error: true });
        }
        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).render("login", { error: true });
        }
        req.user = user; 
        next();
    } catch (err) {
        res.status(500).render("error_404", { message: "Internal server error." });
    }
}

module.exports = password_match;
