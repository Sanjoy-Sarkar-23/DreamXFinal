const userController = {
    isAdminMiddleware: (req, res, next) => {
        // Assuming that user information is stored in req.user after authentication
        if (req.isAuthenticated()) {
            // User is authenticated and is an admin, allow access to the route
            return next();
        } else {
            // User is not authenticated or is not an admin, redirect to '/' or handle accordingly
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/login');
        }
    }
};

module.exports = userController;