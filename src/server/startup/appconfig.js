const path = require('path');
const cors = require('cors');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const expressSanitizer = require('express-sanitizer');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const compression = require('compression');
const responseTime = require('response-time');
const flash = require('express-flash');
const express = require('express');
const axios = require('axios');

const loadUser = require('../middlewares/loadUser');
const initSession = require('../middlewares/initSession');
const initLocals = require('../middlewares/initLocals');
const setLocale = require('../middlewares/setLocale');

const { ENV,
    api,
    PORT,
    AUTH_API_KEY,
    MONGO_URI,
    EXPRESS_SESSION_SECRET,
    FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET,
    GOOGLE_APP_ID,
    GOOGLE_APP_SECRET,
} = require('../../../config/config');


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(async function(user, done) {

    const userId = user._id;
    const URL = api.users.get.replace('{{userId}}', userId)+`?apiKey=${AUTH_API_KEY}&lang=ru`;
    const jwtToken = user.jwtToken || null;
    console.log(user);
    try {
        const response = await axios.get(URL, {
            headers: {
                "x-auth" : jwtToken
            },
        });
        let { user, messages, meta } = response.data;

        done(null, user);

    } catch (e) {
        console.log(e);
        // let { error } = e.response.data;
        // if (!error) {
        //     error = e.messages
        // }

        done(null, user);
    }
});

passport.use(
    new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:4000/user/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log({accessToken,refreshToken,profile})

        const URL = api.users.loginSocial+`?apiKey=${AUTH_API_KEY}&lang=ru`;

        const {id , provider, displayName } = profile;

        try {
            const response = await axios.post(URL, { provider, id, profile });
            let { user, messages, meta, jwtToken } = response.data;

            // const jwtToken = response.headers['x-auth'] ? response.headers['x-auth'] : null;
            // console.log(jwtToken);
            // user._jwt = jwtToken || null;

            done(null, {
                ...user,
                jwtToken
            });

        } catch (e) {
            console.log(e);
            let { error } = e.response.data;
            if (!error) {
                error = e.messages
            }

            done(error, null);
        }
    }
));

passport.use(
    new GoogleStrategy({
        clientID: GOOGLE_APP_ID,
        clientSecret: GOOGLE_APP_SECRET,
        callbackURL: "http://localhost:4000/user/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log({accessToken,refreshToken,profile})

        const URL = api.users.loginSocial+`?apiKey=${AUTH_API_KEY}&lang=ru`;

        const {id , provider, displayName } = profile;

        try {
            const response = await axios.post(URL, { provider, id, profile });
            let { user, messages, meta, jwtToken } = response.data;

            // const jwtToken = response.headers['x-auth'] ? response.headers['x-auth'] : null;
            // console.log(jwtToken);
            // user._jwt = jwtToken || null;

            // if (jwtToken) {
            //     res.cookie('_jwt',jwtToken, { maxAge: 900000, httpOnly: true });
            //     res.header('x-auth', jwtToken);
            // }

            done(null, {
                ...user,
                jwtToken
            });

        } catch (e) {
            let { error } = e.response.data;
            if (!error) {
                error = e.messages
            }

            done(error, null);
        }
    }
));

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
    app.use(setLocale);
    app.use(initLocals);

    app.use(expressSanitizer());

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(loadUser);

};