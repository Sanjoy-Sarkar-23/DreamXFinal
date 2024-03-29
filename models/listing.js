const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    buying: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    kms: Number,
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    category: {
        type: String,
        trim: true,
        required: true
    },
    bodyType: {
        type: String,
        required: true
    },
    fuelType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [{
        url: String,
        filename: String
    }],
    moreImages: {
        type: [{
            url: String,
            filename: String
        }],
        validate: [
            {
                validator: function (value) {
                    return value.length <= 4;
                },
                message: 'More images can have a maximum of 4 items.'
            },
            {
                validator: function (value) {
                    return value.length >= 0;
                },
                message: 'More images must have a minimum of 0 items (can be null).'
            }
        ]
    },
    price: Number,
    isStatus: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    wishListUser: {
        type: [String],
        default: [],
    }
});

const Listing = mongoose.model("Product", listingSchema);
module.exports = Listing;
