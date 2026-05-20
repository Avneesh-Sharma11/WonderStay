const User = require('../models/user.js')

module.exports.singup = async (req, res, next) => {
    try {
        let { username, password, email } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.logIn(registeredUser, (err) => {
            if (err) {
                return next()
            }
            req.flash("success", "Successfully Registered!")
            res.redirect(res.locals.redirectURL || '/listings')
        })
    } catch (error) {
        req.flash("error", error.message)
        res.redirect('/singup')
    }
}

module.exports.login =async (req, res) => {
    req.flash("success", "Welcome Back!")
    res.redirect(res.locals.redirectURL || '/listings')
}

module.exports.logout =(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "Successfully Logged Out!")
        res.redirect('/listings')
    });
}