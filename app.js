if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const path = require("path");
const ejsMate = require("ejs-mate");
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const User = require('./models/user');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');


const app = express();
const dbUrl = process.env.ATLASDB_URL;
const port = process.env.PORT;

app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());




const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    secret: process.env.SECRET,
});

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOption));
// Set up session middleware with a 5-day expiration
// app.use(session({
//     secret: process.env.SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//         httpOnly: true // 5 days in milliseconds
//         // Other cookie options as needed
//     },
// }));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Connect to MongoDB
main().then(() => console.log("connected to DB")).catch((err) => { console.log(err) });

async function main() {
    await mongoose.connect(dbUrl);
}

// 'mongodb://127.0.0.1:27017/dreamx'
// Global middleware to pass user data to views
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// Middleware to check if the user is an admin
const isAdminMiddleware = (req, res, next) => {
    // Assuming that user information is stored in req.user after authentication
    if (req.isAuthenticated() && req.user && req.user.isAdmin === true) {
        // User is authenticated and is an admin, allow access to the route
        return next();
    } else {
        // User is not authenticated or is not an admin, redirect to '/' or handle accordingly
        req.flash('error', 'You do not have permission to access this page.');
        return res.redirect('/login');
    }
};



// Catch-all route for 404 Not Found

// Use the routes
app.use('/', authRoutes);
app.use('/admin', isAdminMiddleware, adminRoutes);
app.use('/', userRoutes);


// Create a middleware function for handling errors
const errorHandler = (err, req, res, next) => {
    // Check if the error is a bad request (400 status code)
    if (err.status === 400) {
        // Redirect to a custom 404 error page
        return res.status(404).render('error/404');
    }

    // For other errors, you can handle them as needed
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
};

app.use(errorHandler);

// app.get('*', (req, res) => {
//     res.status(404).render('error/404');
// });
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const methodOverride = require('method-override')
// const path = require("path");
// const ejsMate = require("ejs-mate");
// const passport = require('passport');
// const bodyParser = require('body-parser');
// const LocalStrategy = require('passport-local');
// const session = require('express-session');
// const Listing = require("./models/listing.js");
// const User = require("./models/user.js");
// const flash = require('connect-flash');
// app.use(express.static(path.join(__dirname, "public")));


// main().then(() => console.log("connected to DB")).catch((err) => { console.log(err) });

// async function main() {
//     await mongoose.connect('mongodb://127.0.0.1:27017/dreamx');
// }

// app.set("view engine", "ejs");
// app.engine('ejs', ejsMate);
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.use(bodyParser.urlencoded({ extended: true }));

// const wishlist = [];

// // Express session middleware
// app.use(session({
//     secret: 'ksadjfkj54dff@',
//     resave: true,
//     saveUninitialized: true,
// }));
// app.use(flash());

// // Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(flash());

// passport.use(new LocalStrategy(
//     (username, password, done) => {
//         User.findOne({ username: username }, (err, user) => {
//             if (err) { return done(err); }
//             if (!user) {
//                 return done(null, false, { message: 'Incorrect username.' });
//             }
//             if (!user.comparePassword(password)) {
//                 return done(null, false, { message: 'Incorrect password.' });
//             }
//             return done(null, user);
//         });
//     }
// ));


// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//     User.findById(id, (err, user) => {
//         done(err, user);
//     });
// });
// app.use((req, res, next) => {
//     res.locals.currentUser = req.user;
//     next();
// });

// app.use((err, req, res, next) => {
//     res.locals.success = req.flash("success");
//     next();
// })

// const userRoutes = require('./routes/userRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const authRoutes = require('./routes/authRoutes');

// // Use the routes
// app.use('/', userRoutes);
// app.use('/admin', adminRoutes);
// app.use('/', authRoutes);

// app.listen(8080, () => {
//     console.log("server is listing port 8080")
// });