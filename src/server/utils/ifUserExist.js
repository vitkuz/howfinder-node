const redirectToUserDashboard = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/user');
    } else {
        next();
    }
};

module.exports = {
    redirectToUserDashboard
}