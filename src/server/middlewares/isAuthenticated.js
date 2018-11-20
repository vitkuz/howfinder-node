const jwt = require('jsonwebtoken');

module.exports = function isAuthenticated(req, res, next) {
    console.log('isAuthenticated applied');
    // res.locals.isAuthenticated = false;

    if (req.session.user) {
        console.log('isAuthenticated');
        // req.session.isAuthenticated = res.locals.isAuthenticated = true;
        next();
    } else {
        console.log('notAuthenticated');
        return res.status(401).json({error: 'You are not authenticated'})
    }
}
