const mongoose = require('mongoose');

// Define the schema for the SellerApply model
const SellerApplySchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    userId: {
        type: String, // Assuming userId is a string, you can adjust the type as needed
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    SellerApplyName: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    kmDriven: {
        type: Number,
        required: true,
    },
    buyingYear: {
        type: String,
        required: true,
    },
    sellingPrice: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    photos: {
        type: [String], // Assuming you store file paths or URLs as strings
        required: true,
    },
});

// Create the mongoose model
const SellerApply = mongoose.model('sellerApply', SellerApplySchema);

module.exports = SellerApply;
