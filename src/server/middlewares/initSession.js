function initSession(err, req, res, next) {
    req.session.uuid = req.session.uuid || uuidv1();
    req.session.user = req.session.user || null;
    req.session.cart = req.session.cart || { products:[] };
    next();
}

module.exports = initSession;