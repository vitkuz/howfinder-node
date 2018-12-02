const jwt = require('jsonwebtoken');
const uuidv1 = require('uuid/v1');

const jsonUserMenu = require('../settings/userMenu');

module.exports = function loadUser(req, res, next) {

    res.locals.csrfToken = req.csrfToken();

    res.locals.uuid = req.session.uuid = req.session.uuid || uuidv1();
    res.locals.user = req.session.user = req.session.user || null;
    res.locals.cart = req.session.cart = req.session.cart || { products:[] };


    res.locals.userMenu = jsonUserMenu;

    next();

    // let _jwt = req.header('x-auth');
    // _jwt = _jwt ? _jwt : req.cookies._jwt;
    // req.user = req.session.user = res.locals.user = null;
    //
    // if (_jwt) {
    //     try {
    //         const decoded = jwt.verify(_jwt, process.env.JWT_SECRET);
    //         console.log(decoded);
    //         req.user = req.session.user = res.locals.user = decoded;
    //         next();
    //     } catch (e) {
    //         console.log('Cant decode. Invalid token. Go---->');
    //         next();
    //     }
    // } else {
    //     console.log('No token. Go->>>');
    //     next();
    // }
}
