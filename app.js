if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const mongoose = require('mongoose')
const Listing = require('./models/listing.js')
const app = express()
const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const asyncWrap = require('./utils/asyncWrap.js')
const MyError = require('./utils/ExpressErr.js')
const { listingSchema } = require('./schema.js')
const Review = require('./models/review.js')
const listingsRouter = require('./routes/listings.js')
const reviewsRouter = require('./routes/reviews.js')
const userRouter = require('./routes/user.js')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user.js')

app.use(methodOverride('_method'))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB Connected");
        app.listen(8080, () => {
            console.log('Server is running at port 8080...');
        });

    } catch (err) {
        console.log("DB connection failed:", err);
    }
}
startServer();

const sessionOptions = {
    secret: "thisshouldbeabettersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
}
app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currentUser = req.user;
    next();
})



app.get('/', (req, res) => {
    res.render('listings/home.ejs')
})

app.use('/', userRouter)
app.use('/listings', listingsRouter)

app.use('/listings/:id/reviews', reviewsRouter)


app.use((req, res, next) => {
    next(new MyError(404, "Page not found"));
});
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Some error Occured" } = err
    console.log(err);
    res.status(statusCode).send(message);
});
// app.listen(8080, () => {
//     console.log('Server is running at port 8080...')
// })
