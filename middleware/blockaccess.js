const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

function already_logged_in(req, res, next) {
    const token = req.cookies.token;
    if (token) {
        try {
            const user = jwt.verify(token, SECRET_KEY);
            if(user.role === "admin"){
                return res.status(303).redirect("/admin");
            }
            else if(user.role === "chef"){
                return res.status(303).redirect("/chef");
            }
            return res.status(303).redirect("/order");
        } catch (err) {
            res.clearCookie("token");
        }
    }
    next();
}
module.exports = already_logged_in;
