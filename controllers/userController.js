// controllers/userController.js
const mongoose = require('mongoose'); // Add this line
const Listing = require('../models/listing.js');
const User = require('../models/user.js');
const Seller = require('../models/selleFrom.js');


const userController = {
    index: async (req, res) => {
        try {
            const motorcycles = await Listing.find({ bodyType: 'Motorcycles', isStatus: true }).sort({ createdAt: -1 }).limit(4);
            const scooters = await Listing.find({ bodyType: 'Scooters', isStatus: true }).sort({ createdAt: -1 }).limit(4);
            const Hatchback = await Listing.find({ bodyType: 'Hatchback', isStatus: true }).sort({ createdAt: -1 }).limit(4);
            const Sedan = await Listing.find({ bodyType: 'Sedan', isStatus: true }).sort({ createdAt: -1 }).limit(4);
            const SUV = await Listing.find({ bodyType: 'SUV', isStatus: true }).sort({ createdAt: -1 }).limit(4);
            const Minivan = await Listing.find({ bodyType: 'Minivan', isStatus: true }).sort({ createdAt: -1 }).limit(4);
            const MUV = await Listing.find({ bodyType: 'MUV', isStatus: true }).sort({ createdAt: -1 }).limit(4);
            const recentlyAddedListings = await Listing.find().sort({ createdAt: -1 });
            // Render the user view with the data
            res.render('user/index', { recentlyAddedListings, motorcycles, scooters, Hatchback, Sedan, SUV, Minivan, MUV });
        } catch (error) {
            console.error('Error retrieving bike listings:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },



    shortlist: async (req, res) => {
        try {
            // Fetch user ID from the request or your authentication system
            const userId = req.user._id; // Assuming you have user information in the request

            // Fetch user's wishlist based on the user ID
            const userWishlist = await Listing.find({ wishListUser: { $in: [userId] } });

            const pageTitle = "Wishlist";
            res.render("user/shortlist", { pageTitle, userWishlist });
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            res.status(500).send('Internal Server Error');
        }
    },

    // wishlist: async (req, res) => {
    //     try {
    //         // Fetch user ID from the request or your authentication system
    //         const userId = req.user._id; // Assuming you have user information in the request

    //         // Fetch user's wishlist based on the user ID
    //         const userWishlist = await User.findById(userId).populate('wishlist');

    //         const pageTitle = "Wishlist";
    //         res.render('wishlist', { pageTitle, userWishlist });
    //     } catch (error) {
    //         console.error('Error fetching wishlist:', error);
    //         res.status(500).send('Internal Server Error');
    //     }
    // },

    shop: async (req, res, next) => {
        try {
            let filteredListings;
            const { filter } = req.params;

            // Check if a filter parameter is provided in the route
            if (filter) {
                // If filter parameter is provided, filter the listings by bodyType or category
                filteredListings = await Listing.find({ $or: [{ bodyType: filter }, { brand: filter }, { category: filter }] });
            } else {
                // If no filter parameter, fetch all listings
                filteredListings = await Listing.find({});
            }

            res.render('user/shop', { allListings: filteredListings, filter });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },


    // shop: async (req, res, next) => {
    //     try {
    //         let filteredListings;
    //         const { filter } = req.params;

    //         // Check if a filter parameter is provided in the route
    //         if (filter) {
    //             // If filter parameter is provided, filter the listings by bodyType or category
    //             filteredListings = await Listing.find({ $or: [{ bodyType: filter }, { brand: filter }, { category: filter }] });
    //         } else {
    //             // If no filter parameter, fetch all listings
    //             filteredListings = await Listing.find({});
    //         }

    //         // Check if any listings were found
    //         if (filteredListings.length === 0) {
    //             // Render a view indicating that no data was found
    //             return res.render('user/no-data-found', { filter });
    //         }

    //         // Render the shop view with the found listings
    //         res.render('user/shop', { allListings: filteredListings, filter });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).send('Internal Server Error');
    //     }
    // },



    product: async (req, res) => {
        try {
            let { id } = req.params;

            // Validate if the provided ID is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).send('Invalid product ID');
            }

            const listing = await Listing.findById(id);

            if (!listing) {
                return res.status(404).send('Product not found');
            }

            // Check if the user is in the wishlist for this product
            const userId = req.user ? req.user._id : null; // Assuming user information is stored in req.user

            let isInWishlist = false;
            if (userId) {
                isInWishlist = listing.wishListUser.includes(userId);
            }

            res.render("user/product", { listing, isInWishlist });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
    // try {
    //     let { id } = req.params;
    //     const listing = await Listing.findById(id);
    //     res.render("user/product", { listing });
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).send('Internal Server Error');
    // }

    // app.get('/product/:id', async (req, res) => {
    //     try {
    //         let { id } = req.params;

    //         // Validate if the provided ID is a valid ObjectId
    //         if (!mongoose.Types.ObjectId.isValid(id)) {
    //             return res.status(400).send('Invalid product ID');
    //         }

    //         const listing = await Product.findById(id);

    //         if (!listing) {
    //             return res.status(404).send('Product not found');
    //         }

    //         res.render("product.ejs", { listing });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).send('Internal Server Error');
    //     }
    // });

    order: (req, res) => {
        res.render("user/order");
    },

    seller: (req, res) => {
        res.render("user/seller");
    },

    sellerApply: async (req, res) => {
        try {
            // Extract data from the form submission
            const { Date, SellerApplyName, model, kmDriven, buyingYear, sellingPrice, location, photos } = req.body;

            // Access current user data from req.user
            const userId = req.user._id; // Assuming user ID is stored in the _id field
            const userName = req.user.displayName; // Replace with the actual field containing the user's name

            // Create a new SellerApply instance using the Mongoose model
            const newSellerApply = new Seller({
                date: Date,
                userId,
                userName,
                SellerApplyName,
                model,
                kmDriven,
                buyingYear,
                sellingPrice,
                location,
                photos,
            });

            // Save the new SellerApply entry to the database
            await newSellerApply.save();

            // Redirect or respond as needed
            res.redirect('/'); // Redirect to a success page or handle the response accordingly
        } catch (error) {
            console.error('Error creating SellerApply:', error);
            res.status(500).send('Internal Server Error'); // Handle errors appropriately
        }
    },

    contactUs: (req, res) => {
        res.render("user/contact-us");
    },

    changePassword: (req, res) => {
        res.render("user/change-password");
    },

    editProfile: (req, res) => {
        res.render("user/edit-profile");
    },

    userProfile: (req, res) => {
        res.render("user/profile");
    },

    login: (req, res) => {
        res.render("user/login");
    },

    wishList: async (req, res, next) => {
        console.log('req.body:', req.body);
        const { _id } = req.body;
        console.log('_id:', _id);
        // Assuming you're using Passport.js and have a user object attached to req.user
        const userId = req.user._id;
        try {
            // Update wishListUser field with unique user ID using $addToSet
            const updatedListing = await Listing.findByIdAndUpdate(
                _id,
                { $addToSet: { wishListUser: userId } },
                { new: true }
            );
            console.log(updatedListing);
            if (!updatedListing) {

                return { success: false, message: 'Listing not found' };
            }

            return res.json({ success: true, message: 'Wishlist updated successfully' });
        } catch (error) {
            console.error('Error updating wishlist:', error);
            return { success: false, message: 'Internal server error.' };
        }

    },
    wishlistRemove: async (req, res, next) => {
        console.log('req.body:', req.body);
        const { _id } = req.body;
        console.log('_id:', _id);
        const userId = req.user._id;

        try {
            // Update wishListUser field by removing the user ID using $pull
            const updatedListing = await Listing.findByIdAndUpdate(
                _id,
                { $pull: { wishListUser: userId } },
                { new: true }
            );

            console.log(updatedListing);

            if (!updatedListing) {
                return res.json({ success: false, message: 'Listing not found' });
            }

            return res.json({ success: true, message: 'Listing removed from wishlist successfully' });
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            return res.json({ success: false, message: 'Internal server error.' });
        }
    }


};

module.exports = userController;