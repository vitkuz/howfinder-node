const jwt = require('jsonwebtoken');
const uuidv1 = require('uuid/v1');

const notLoginUserMenu = require('../settings/notLoginUserMenu');
const isLoginUserMenu = require('../settings/isLoginUserMenu');
const userActionsMenu = require('../settings/userActionsMenu');
const websites = require('../settings/websites');

module.exports = function loadUser(req, res, next) {

    res.locals.csrfToken = req.csrfToken();

    res.locals.uuid = req.session.uuid = req.session.uuid || uuidv1();
    req.user = res.locals.user = req.session.user = req.session.user || (req.session.passport && req.session.passport.user) || null;
    res.locals.cart = req.session.cart = req.session.cart || { products:[] };

    if (res.locals.user) {
        res.locals.userMenu = isLoginUserMenu;
        res.locals.userActions = userActionsMenu;
    } else {
        res.locals.userMenu = notLoginUserMenu;
        res.locals.userActions = null;
    }

    res.locals.websites = websites;

    // console.log(req.session);

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
