const jwt = require('jsonwebtoken');

async function logHeaders(req, res, next) {
    // console.log('req.headers',req.headers);
    // console.log('x-auth',req.header('x-auth'));
    let _jwt = req.header('x-auth');
    _jwt = _jwt ? _jwt : req.cookies._jwt;
    // Headers
    console.log('logHeaders.js Headers: ', req.headers);

    // Cookies that have not been signed
    console.log('logHeaders.js Cookies: ', req.cookies);

    // Cookies that have been signed
    console.log('logHeaders.js Signed Cookies: ', req.signedCookies);

    if (jwt) {
        try {
            const decoded = jwt.verify(_jwt, process.env.JWT_SECRET);
            console.log('logHeaders.js Token decoded',req.method);
            console.log(decoded);
            req.user = res.locals.user = decoded;
        } catch (e) {
            console.log('logHeaders.js Cant decode. Invalid token',req.method);
            req.user = null;
        }
    } else {
        console.log('logHeaders.js No jwt token was provided',req.method);
        req.user = {_id:null, roles:['guest']};
    }

    next();
}

module.exports = logHeaders;