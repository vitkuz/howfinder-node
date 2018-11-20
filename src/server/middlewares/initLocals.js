function initLocals(err, req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    res.locals.uuid = req.session.uuid;
    res.locals.user = req.session.user;
    res.locals.cart = req.session.cart;
    next();
}

module.exports = initLocals;