const path = require('path');
const cors = require('cors');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const expressSanitizer = require('express-sanitizer');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const compression = require('compression');
const responseTime = require('response-time');
const flash = require('express-flash');
const express = require('express');

const loadUser = require('../middlewares/loadUser');
const initSession = require('../middlewares/initSession');
const initLocals = require('../middlewares/initLocals');
const initLocale = require('../middlewares/initLocale');

const { ENV, PORT, MONGO_URI, EXPRESS_SESSION_SECRET } = require('../../../config/config');

module.exports = function (app) {

    const staticPath = path.join(__dirname,'..','..','..','public'); //@todo move to config file
    const viewsPath = path.join(__dirname,'..','views'); //@todo move to config file

    app.use(express.static(staticPath));

    app.use(compression());
    app.use(responseTime());

    app.disable('x-powered-by');

    app.set('port', PORT);
    app.set('trust proxy', true);
    app.set('view engine', 'pug');
    app.set('views', viewsPath);

    app.use(helmet());

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({extended: true}))

    // parse application/json
    app.use(bodyParser.json());

    // Mount express-sanitizer here

    app.use(cookieParser());

    app.use(initLocale);

    app.use(session({
        secret: EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({ url: MONGO_URI })
    }));

    app.use(flash());

    app.use(csrf({ cookie: true }));

    // app.use(csrfMiddleware);
    app.use(initSession);
    app.use(initLocals);

    app.use(expressSanitizer());

    app.use(loadUser);

};