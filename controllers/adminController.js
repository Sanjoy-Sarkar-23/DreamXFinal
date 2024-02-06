// controllers/adminController.js
const mongoose = require('mongoose');
const Listing = require('../models/listing.js');
const User = require('../models/user.js');
const multer = require('multer');
const { cloudinary, storage } = require('../cloudconfig.js');
// const storages = multer.memoryStorage()

const upload = multer({ storage })


const adminController = {
    admin: async (req, res) => {
        try {

            const pageTitle = "Dashboard | Dream X car and bike sale";
            res.render('admin/admin', { pageTitle });
        } catch (error) {
            console.error('Error fetching listings:', error);
            res.status(500).send('Internal Server Error');
        }
    },
    add_order: async (req, res) => {

        const pageTitle = "Dashboard | Add Order";
        // Render the admin view with the data
        res.render('admin/add-order', { pageTitle });
    },
    createListing: async (req, res) => {
        try {
            upload.fields([{ name: 'images', maxCount: 1 }, { name: 'moreImages' }])(req, res, async (err) => {
                if (err) {
                    console.error('Error uploading images:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Image upload failed.'
                    });
                }

                const {
                    buying,
                    name,
                    kms,
                    brand,
                    model,
                    category,
                    bodyType,
                    fuelType,
                    description,
                    price,
                } = req.body;

                if (!buying || !name || !kms || !brand || !model || !category || !bodyType || !fuelType || !description || !price) {
                    console.error('Invalid request body:', req.body);
                    return res.status(400).json({
                        success: false,
                        message: 'Please fill in all required fields.'
                    });
                }

                // Retrieve the image URLs from Cloudinary
                const mainImage = req.files['images'][0];
                const moreImages = req.files['moreImages'] || []; // Handle the case where moreImages is not provided

                // Check the length of moreImages
                if (moreImages.length > 4) {
                    return res.status(400).json({
                        success: false,
                        message: 'More images can have a maximum of 4 items.'
                    });
                }

                // Create a new listing in MongoDB
                const newListing = await Listing.create({
                    buying,
                    name,
                    kms,
                    brand,
                    model,
                    category,
                    bodyType,
                    fuelType,
                    description,
                    images: { url: mainImage.path, filename: mainImage.filename },
                    moreImages: moreImages.map(image => ({ url: image.path, filename: image.filename })),
                    price,
                });
                console.error('Error creating new listing:', newListing);
                // Redirect to the vehicle page after creating the new listing
                req.flash('successMessage', 'Listing created successfully.');
                res.redirect('/admin/vehicle');
            });
        } catch (error) {
            console.error('Error creating new listing:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error.'
            });
        }
    },


    add_vehicle: (req, res) => {
        // Fetch data from the admin model
        // const admins = adminModel.getAllAdmins();
        const pageTitle = "Dashboard | Add Vehicle";
        // Render the admin view with the data
        res.render('admin/add-vehicle', { pageTitle });
    },
    order: (req, res) => {
        // Fetch data from the admin model
        // const admins = adminModel.getAllAdmins();
        const pageTitle = "Dashboard | Order Page";
        // Render the admin view with the data
        res.render('admin/order', { pageTitle });
    },
    brands: (req, res) => {
        // Fetch data from the admin model
        // const admins = adminModel.getAllAdmins();
        const pageTitle = "Dashboard | Brands";
        // Render the admin view with the data
        res.render('admin/brands', { pageTitle });
    },
    banner: (req, res) => {
        // Fetch data from the admin model
        // const admins = adminModel.getAllAdmins();
        const pageTitle = "Dashboard | Banner";
        // Render the admin view with the data
        res.render('admin/banner', { pageTitle });
    },
    edit_order: (req, res) => {
        // Fetch data from the admin model
        // const admins = adminModel.getAllAdmins();
        const pageTitle = "Dashboard | Edit Order";
        // Render the admin view with the data
        res.render('admin/edit-order', { pageTitle });
    },
    edit_vehicle: async (req, res) => {
        try {// Fetch data from the admin model
            let { id } = req.params;
            // Validate if the provided ID is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).send('Invalid product ID');
            }
            const pageTitle = "Dashboard | Edit Vehicle";
            const listing = await Listing.findById(id);
            // Render the admin view with the data
            if (!listing) {
                return res.status(404).send('Product not found');
            }
            res.render('admin/edit-vehicle', { pageTitle, listing });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    vehicle: async (req, res) => {
        // Fetch data from the admin model
        // const admins = adminModel.getAllAdmins();
        const allListings = await Listing.find({});
        const pageTitle = "Dashboard | Vehicle View";
        // Render the admin view with the data
        res.render('admin/vehicle', { pageTitle, allListings });
    },
    user: async (req, res) => {
        // Fetch data from the admin model
        // const admins = adminModel.getAllAdmins();
        const pageTitle = "Dashboard | User";
        const allUser = await User.find({});
        // Render the admin view with the data
        res.render('admin/user', { pageTitle, allUser });
    },
    seller_admin: (req, res) => {
        // Fetch data from the admin model
        // const admins = adminModel.getAllAdmins();
        const pageTitle = "Dashboard | Seller Admin";
        // Render the admin view with the data
        res.render('admin/seller-admin', { pageTitle });
    },
    category: (req, res) => {
        // Fetch data from the admin model
        // const admins = adminModel.getAllAdmins();
        const pageTitle = "Dashboard | Category";
        // Render the admin view with the data
        res.render('admin/category', { pageTitle });
    },
    admin_profile: (req, res) => {
        // Fetch data from the admin model
        // const admins = adminModel.getAllAdmins();
        const pageTitle = "Dashboard | Admin Profile";
        // Render the admin view with the data
        res.render('admin/admin-profile', { pageTitle });
    },
    body_type: (req, res) => {
        // Fetch data from the admin model
        // const admins = adminModel.getAllAdmins();
        const pageTitle = "Dashboard | Body Type";
        // Render the admin view with the data
        res.render('admin/body-type', { pageTitle });
    },
    deleteItem: async (req, res) => {
        const itemId = req.params.id;

        try {
            // Perform the delete operation using a Promise (no callback)
            let deletedListing = await Listing.findByIdAndDelete(itemId);

            // Check if the item was successfully deleted
            if (!deletedListing) {
                // Item not found, handle accordingly
                return res.status(404).json({ success: false, message: 'Item not found' });
            }

            // Successful deletion
            console.log('Deleted Listing:', deletedListing);
            res.json({ success: true, message: 'Listing deleted successfully.' }); // Send a JSON response

        } catch (error) {
            console.error('Error deleting listing:', error);
            res.status(500).json({ success: false, message: 'Internal server error.' });
        }
    },
    editItem: async (req, res) => {
        const itemId = req.params.id;

        try {
            // Validate if the provided ID is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(itemId)) {
                req.flash('error', 'Listing does not exist!');
                return res.redirect('/admin');
            }

            // Use multer to upload images
            upload.fields([{ name: 'images', maxCount: 1 }, { name: 'moreImages' }])(req, res, async (err) => {
                if (err) {
                    console.error('Error uploading images:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Image upload failed.'
                    });
                }

                // Find the listing by ID
                let listing = await Listing.findById(itemId);

                // Check if the item was found
                if (!listing) {
                    // Item not found, handle accordingly
                    req.flash('error', 'Listing does not exist!');
                    return res.redirect('/admin');
                }

                // Update the listing with the data from the request body
                listing = Object.assign(listing, req.body);

                // Update the image URLs if new images are provided
                if (req.files['images'] && req.files['images'].length > 0) {
                    const mainImage = req.files['images'][0];
                    listing.images = { url: mainImage.path, filename: mainImage.filename };
                }

                if (req.files['moreImages'] && req.files['moreImages'].length > 0) {
                    const moreImages = req.files['moreImages'];
                    listing.moreImages = moreImages.map(image => ({ url: image.path, filename: image.filename }));
                }

                // Save the updated listing
                let updatedListing = await listing.save();

                // Successful update
                console.log('Updated Listing:', updatedListing);
                req.flash('success', 'Listing updated successfully.');
                res.redirect('/admin/vehicle');
            });
        } catch (error) {
            console.error('Error updating listing:', error);
            req.flash('error', 'Listing updated Unsuccessfully.');
            return res.redirect('/admin');
        }
    },



};

module.exports = adminController;
