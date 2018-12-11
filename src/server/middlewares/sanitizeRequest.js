module.exports = function(req, res, next) {
    Object.keys(req.query).forEach(key => {
        req.query[key] = req.sanitize(req.query[key]);
    });
    Object.keys(req.params).forEach(key => {
        req.params[key] = req.sanitize(req.params[key]);
    });
    Object.keys(req.body).forEach(key => {
        req.body[key] = req.sanitize(req.body[key]);
    });
    next();
};
