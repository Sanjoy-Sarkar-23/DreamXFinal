// Import necessary modules and packages
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const ejsMate = require("ejs-mate");
const path = require("path");
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const User = require('./models/user');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const LocalStrategy = require('passport-local').Strategy;

// Initialize Express application
const app = express();
const dbUrl = process.env.ATLASDB_URL;
const port = process.env.PORT || 8080;

// Set up view engine and middleware
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());

// Set up session and MongoDB store
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    secret: process.env.SECRET,
    touchAfter: 24 * 3600, // time period in seconds
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

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Connect to MongoDB
main().then(() => console.log("Connected to DB")).catch((err) => console.error(err));

async function main() {
    await mongoose.connect(dbUrl);
}

// Middleware to check if the user is an admin
const isAdminMiddleware = (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.isAdmin === true) {
        return next();
    } else {
        req.flash('error', 'You do not have permission to access this page.');
        return res.redirect('/login');
    }
};

// Global middleware to pass user data to views
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Use the routes
app.use('/', authRoutes);
app.use('/admin', isAdminMiddleware, adminRoutes);
app.use('/', userRoutes);

// Create a middleware function for handling errors
const errorHandler = (err, req, res, next) => {
    if (err.status === 400) {
        return res.status(404).render('error/404');
    }
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
};

app.use(errorHandler);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
