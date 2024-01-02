const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { v4: uuidv4 } = require('uuid');

// Define the user schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        default: uuidv4, // Set default value to a new UUID
        required: true
    },
    displayName: {
        type: String,
        trim: true,
        required: true
    },
    phoneNumber: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    wishlist: [{ productId: String }],
});

// Add passport-local-mongoose plugin to enable authentication methods
userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    usernameQueryFields: ['email', 'phoneNumber'] // Allow authentication using both email and phoneNumber
});
const User = mongoose.model('users', userSchema);

module.exports = User;