const express = require('express');
const pool = require('./db.js');
const path = require('path');
const PORT = 3000;
const cookie_parser = require('cookie-parser');
const app = express();

const home_router = require('./routes/home.js');
const login_router = require('./routes/login.js');
const signup_router = require('./routes/signup.js');
const order_router = require('./routes/order.js');
const admin_router = require('./routes/admin.js');
const chef_router = require('./routes/chef.js');
const review_router = require('./routes/review.js');
const logout_router = require('./routes/logout.js');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cookie_parser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res) => {
    res.render('home');
})

app.use("/home", home_router);
app.use("/login", login_router);
app.use("/signup", signup_router);
app.use("/order", order_router);
app.use("/admin", admin_router);
app.use("/chef", chef_router);
app.use("/review", review_router);
app.use("/logout", logout_router);

app.get('/err', (req,res) => {
    res.render('error_404');
});
app.use((req, res) => {
    res.status(404).render("error_404");
});


app.listen(PORT, () => console.log(`Server active on ${PORT}`));