const express = require('express');
const app = express();
const PORT = process.env.PORT || 80;
const expressLayout = require('express-ejs-layouts');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI;
const flash = require('connect-flash');
const session = require('express-session');

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch(err => {
        console.log(err);
    })
app.use(expressLayout);
app.set("view engine", 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,

}));
app.use(flash);
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
});
app.use('/', indexRouter);
app.use('/users', userRouter);





app.listen(PORT, console.log("Serving on PORT: " + PORT));