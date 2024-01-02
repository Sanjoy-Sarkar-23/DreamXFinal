const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/user.js');
const { isAdminMiddleware } = require('../routes/middleware');

const authController = {
    // Display signup form
    getSignup: (req, res) => {
        // if (isLoggedIn) {
        //     res.redirect('/')
        // }
        res.render('user/signup');
    },

    // Handle signup form submission
    postSignup: async (req, res, next) => {
        try {
            console.log('Received signup request:', req.body);
            const { email, displayName, phoneNumber, password, confirmPassword } = req.body;

            // Check if passwords match
            if (password !== confirmPassword) {
                req.flash('error', 'Passwords do not match.');
                return res.redirect('/signup');
            }

            // Check for existing user with the same email
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                req.flash('error', 'An account with this email already exists. Please use a different email.');
                return res.redirect('/signup');
            }

            // Create a new user with the provided information
            const user = new User({ email, displayName, phoneNumber });

            // Use passport-local-mongoose register method
            const registerUser = await User.register(user, password);

            console.log(registerUser);
            req.login(registerUser, (loginErr) => {
                if (loginErr) {
                    console.error("Error during login:", loginErr);
                    return res.redirect('/signup'); // Redirect or handle the error as needed
                }
                res.redirect('/');
            });

        } catch (error) {
            console.error('Error in postSignup:', error);
            // Handle specific duplicate key error for email uniqueness
            if (error.name === 'MongoError' && error.code === 11000) {
                req.flash('error', 'An account with this email already exists. Please use a different email.');
                return res.redirect('/signup');
            }

            console.error('Error creating user:', error);
            req.flash('error', 'Error creating user. Please try again.');
            res.redirect('/signup');
        }
    },


    // Display login form
    getLogin: (req, res) => {
        // if (isLoggedIn()) {
        //     res.redirect('/')
        // }
        res.render('user/login');


    },

    // Handle login form submission
    postLogin: (req, res, next) => {
        passport.authenticate('local', {
            usernameField: 'username',  // Change the username field to 'username'
            passReqToCallback: true  // Pass the request object to the callback
        }, (err, user, info) => {
            if (err) {
                console.error('Error during authentication:', err);
                req.flash('error', 'An error occurred during login. Please try again.');
                return res.redirect('/login');
            }

            if (!user) {
                req.flash('error', 'Invalid username or password.');
                return res.redirect('/login');
            }

            req.logIn(user, (err) => {
                if (err) {
                    console.error('Error during login:', err);
                    req.flash('error', 'An error occurred during login. Please try again.');
                    return res.redirect('/login');
                }

                req.flash('success', 'Welcome back!');

                // Check if the user is an admin
                if (user.isAdmin === true) {
                    // Redirect to the admin directory
                    return res.redirect('/admin');
                }

                // Redirect to the home page for non-admin users
                return res.redirect('/');
            });
        })(req, res, next);
    },
    // Logout the user
    logout: (req, res, next) => {
        // Perform any additional cleanup or actions before logout if needed
        // For example, clear additional user-related data stored in the session
        req.session.additionalUserData = null;

        req.logout(function (err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
    },



};

module.exports = authController;
