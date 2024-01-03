// controllers/adminController.js
const mongoose = require('mongoose');
const Listing = require('../models/listing.js');
const User = require('../models/user.js');

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
                image,
                price,
                moreImages,
            } = req.body;

            // Validate required fields
            if (!buying || !name || !brand || !model || !category || !bodyType || !fuelType || !description || !price || Array.isArray(moreImages)) {
                console.error('Invalid request body:', req.body);
                return res.status(400).json({
                    success: false,
                    message: 'Please fill in all required fields.'
                });
            }

            // Create a new listing
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
                image,
                price,
                moreImages,
            });

            // Redirect to the vehicle page after creating the new listing
            req.flash('successMessage', 'Listing created successfully.');
            res.redirect('/vehicle');

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
                return res.status(400).json({ success: false, message: 'Invalid item ID' });
            }

            // Find the listing by ID and update it with the data from the request body
            let updatedListing = await Listing.findByIdAndUpdate(itemId, req.body, { new: true });

            // Check if the item was successfully updated
            if (!updatedListing) {
                // Item not found, handle accordingly
                return res.status(404).json({ success: false, message: 'Item not found' });
            }

            // Successful update
            console.log('Updated Listing:', updatedListing);
            req.flash('successMessage', 'Listing updated successfully.');
            res.redirect('/vehicle'); // Send a JSON response

        } catch (error) {
            console.error('Error updating listing:', error);
            res.status(500).json({ success: false, message: 'Internal server error.' });
        }
    },




};

module.exports = adminController;
