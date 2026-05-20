const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const passport = require('passport')
const { saveRedirectURL } = require('../middleware.js')
const { singup, login, logout } = require('../Controllers/user.js')

router.route('/singup')
    .get((req, res) => {
        res.render('users/singup.ejs')
    })
    .post(saveRedirectURL, singup)

router.route('/login')
    .get((req, res) => {
        res.render('users/login.ejs')
    })
    .post(saveRedirectURL, passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login'
    }), login)


router.get('/logout', logout)

module.exports = router;