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
    image: {
        type: String,
        default: "https://imgd.aeplcdn.com/1056x594/n/cw/ec/102709/ntorq-125-right-front-three-quarter.jpeg?isig=0&q=80&wm=2",
        set: (v) => v === "" ?
            "https://images.unsplash.com/photo-1536782376847-5c9d14d97cc0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnJlZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" : v,
    },
    price: Number,
    moreImages: {
        type: [String],  // An array of strings for multiple image URLs
        default: [],    // Default to an empty array
    },
    isStatus: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        get: function () {
            return this._createdAt.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        },
        set: function (value) {
            // Assuming `value` is a date string in "dd/mm/yyyy" format
            const parts = value.split('/');
            this._createdAt = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
    },
    wishListUser: {
        type: [String],
        default: [],
    }

});

const Listing = mongoose.model("Producet", listingSchema);
module.exports = Listing;