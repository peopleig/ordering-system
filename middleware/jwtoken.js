const jwtoken = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

function jwt_verify(req,res,next) {
    try {
        const token = req.cookies.token;
        const user = jwtoken.verify(token, SECRET_KEY);
        req.user = user;
        next();
    }
    catch(err){
        res.clearCookie("token");
        return res.status(401).redirect("/login");
    }
}
module.exports = jwt_verify;