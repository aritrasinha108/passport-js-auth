const express = require('express');
const router = express.Router();
const Users = require('../model/Users');
const bcrypt = require('bcryptjs');
router.get('/login', (req, res) => {
    res.render("login");
})

router.get('/register', (req, res) => {
    res.render("register");
});
router.post('/register', (req, res) => {
    console.log(req.body);
    const { name, email, password, password2 } = req.body;
    let errors = [];
    if (!name || !email || !password || !password2) {
        errors.push({ message: "Please fill all the fields" });

    }
    if (password != password2) {
        errors.push({ message: "Passwords do not match" });
    }
    if (password.length < 6) {
        errors.push({ message: "Password should be atleast 6 characters long" });
    }
    if (errors.length > 0) {
        res.render("register", {
            errors,
            name,
            email,
            password, password2
        });
    }
    else {
        Users.findOne({ email: email })
            .then(user => {
                if (user) {
                    res.render("register", {
                        errors,
                        name,
                        email,
                        password, password2
                    });
                    errors.push({ message: "User already registered." });

                }
                else {
                    const newUser = new Users({
                        name: name,
                        email: email,
                        password: password
                    });
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', "You are registered successfully, login to continue");
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err))
                    }))
                }
            })
    }

})


module.exports = router;