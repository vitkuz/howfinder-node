const express = require('express');
const _ = require('lodash');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');

const ifUserExist = require('../../../utils/ifUserExist');
const ifUserNotExist = require('../../../utils/ifUserNotExist');
const verifyUserByEmail = require('../../../utils/verifyUserByEmail');
const flashMessages = require('../../../utils/flashMessages');

const { api, AUTH_API_KEY } = require('../../../../../config/config');


router.get('/user/login', async (req,res,next) => {

    req.flash('info', 'info');
    req.flash('warning', "warning");
    req.flash('error', "error");
    req.flash('success', "success");


    res.render('user/loginPage', {
        pageTitle: 'User login page',
        path: '/user/login',
    });
});

router.post('/user/login', async (req,res,next) => {

    const email = req.body.email = req.sanitize(req.body.email);
    const password = req.body.password = req.sanitize(req.body.password);

    const URL = api.users.login+`?apiKey=${AUTH_API_KEY}`;
    try {
        const response = await axios.post(URL, {email, password});
        const { user, messages } = response.data;
        if (user) {
            const jwtToken = response.headers['x-auth'] ? response.headers['x-auth'] : null;
            if (jwtToken) {
                res.cookie('_jwt',jwtToken, { maxAge: 900000, httpOnly: true });
                res.header('x-auth', jwtToken);
            }
            req.session.user = user;

            flashMessages(req, messages);
            req.flash('info', 'Seems like login');

            res.redirect('/user/dashboard')
        }

    } catch(e) {
        let { error } = e.response.data;
        if (!error) {
            error = e.message;
        }

        console.log(error);
        req.flash('error', error);

        res.render('user/loginPage', {
            pageTitle: 'User login page',
            path: '/user/login'
        });
        // console.log('userRouter.js',e);
    }

});

router.get('/user/register', async (req,res,next) => {

    req.flash('info', 'info');
    req.flash('warning', "warning");
    req.flash('error', "error");
    req.flash('success', "success");

    res.render('user/registerPage', {
        pageTitle: 'User register page',
        path: '/user/register',
    });
});

router.post('/user/register', async (req,res,next) => {
    const email = req.body.email = req.sanitize(req.body.email);
    const username = req.body.username = req.sanitize(req.body.username);
    const password = req.body.password = req.sanitize(req.body.password);

    const URL = api.users.register+`?apiKey=${AUTH_API_KEY}`;
    try {
        const response = await axios.post(URL, {email, username, password}, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const { user, messages, meta } = response.data;

        flashMessages(req, messages);
        console.log(user, messages, meta);

        if (user) {
            console.log('registrated user',user);
            res.redirect('/user/login')
        }
    } catch(e) {

        let { error } = e.response.data;
        if (!error) {
            error = e.messages
        }
        req.flash('error', error);

        console.log('/user/register',error);

        res.render('user/registerPage', {
            pageTitle: 'User register page',
            path: '/user/register',
        });
    }
});

router.get('/user/verify/:activationToken', async (req,res,next) => {
    const activationToken = req.params.activationToken = req.sanitize(req.params.activationToken);
    const URL = `${api.users.verify}?apiKey=${AUTH_API_KEY}`;

    try {
        const response = await axios.post(URL, { activationToken });
        const { user, messages, meta } = response.data;

        flashMessages(req, messages);
        console.log(user, messages, meta);

        if (user) {
            console.log('user verified',user);

            res.render('user/activationSuccess', {
                pageTitle: 'activationSuccess',
                path: '/user/verify/success',
            });
        }
    } catch(e) {
        let { error } = e.response.data;
        if (!error) {
            error = e.messages
        }

        req.flash(error);
        console.log(error);

        res.render('user/activationFail', {
            pageTitle: 'activationFail',
            path: '/user/verify/fail',
        });
    }
});



router.get('/user', ifUserNotExist.redirectToLogin, ifUserExist.redirectToDashboard);

router.get('/user/edit', ifUserNotExist.redirectToLogin, async (req, res, next) => {

    const user = req.session.user;
    const URL = api.users.get.replace('{{userId}}', user._id)+`?apiKey=${AUTH_API_KEY}`;

    try {
        const response = await axios.get(URL);
        const { user, messages, meta } = response.data;

        flashMessages(req, messages);
        console.log(user, messages, meta);

        res.render('user/editUserPage', {
            pageTitle: 'Edit user',
            path: '/user/dashboard',
            user: user
        });

    } catch (e) {
        let { error } = e.response.data;
        if (!error) {
            error = e.messages
        }

        req.flash(error);
        console.log(error);

        next(error);
    }
});

router.post('/user/edit', ifUserNotExist.redirectToLogin, async (req, res, next) => {

    const user = req.session.user;
    const URL = api.users.update.replace('{{userId}}', user._id)+`?apiKey=${AUTH_API_KEY}`;

    // const _id = req.body._id = req.sanitize(req.body._id);
    const username = req.body.username = req.sanitize(req.body.username);
    const email = req.body.email = req.sanitize(req.body.email);

    const firstname = req.body.firstname = req.sanitize(req.body.firstname);
    const lastname = req.body.lastname = req.sanitize(req.body.lastname);
    const website = req.body.website = req.sanitize(req.body.website);

    const password = req.body.password = req.sanitize(req.body.password);
    const newPassword = req.body.newPassword = req.sanitize(req.body.newPassword);
    const confirmPassword = req.body.confirmPassword = req.sanitize(req.body.confirmPassword);

    const vk = req.body.vk = req.sanitize(req.body.vk);
    const facebook = req.body.facebook = req.sanitize(req.body.facebook);
    const google = req.body.google = req.sanitize(req.body.google);
    const odnoklassniki = req.body.odnoklassniki = req.sanitize(req.body.odnoklassniki);
    const twitter = req.body.twitter = req.sanitize(req.body.twitter);
    const youtube = req.body.youtube = req.sanitize(req.body.youtube);
    const instagram = req.body.instagram = req.sanitize(req.body.instagram);

    const updatedUser = {
        username,
        email,
        profile: {
            firstname,
            lastname,
            website,
            vk,
            facebook,
            google,
            odnoklassniki,
            twitter,
            youtube,
            instagram
        },
        password,
        newPassword
    };



    try {
        const response = await axios.put(URL, updatedUser);
        const { user, messages, meta } = response.data;

        flashMessages(req, messages);
        console.log(user, messages, meta);

        res.render('user/editUserPage', {
            pageTitle: 'user/edit',
            path: '/user/edit',
            user: user
        });

    } catch (e) {
        let { error } = e.response.data;
        if (!error) {
            error = e.messages
        }

        req.flash(error);
        console.log(error);

        res.redirect('/user/edit');
    }
});

router.get('/user/dashboard',ifUserNotExist.redirectToLogin, (req, res, next) => {
    res.render('user/dashboard', { pageTitle: 'Dashboard' });
});

router.get('/user/products',ifUserNotExist.redirectToLogin, (req, res, next) => {
    res.render('user/products', { pageTitle: 'Products' })
});

router.get('/user/history',ifUserNotExist.redirectToLogin, (req, res, next) => {
    res.render('user/history', { pageTitle: 'History' })
});

router.get('/user/messages',ifUserNotExist.redirectToLogin, (req, res, next) => {
    res.render('user/messages', { pageTitle: 'Messages' })
});

router.get('/user/favorites',ifUserNotExist.redirectToLogin, (req, res, next) => {
    res.render('user/favorites', { pageTitle: 'Favorites' })
});

router.get('/user/login', ifUserExist.redirectToDashboard, (req, res, next) => {
    res.render('user/login', { pageTitle: 'login' })
});

router.get('/user/register', ifUserExist.redirectToDashboard, (req, res, next) => {
    res.render('user/register', { pageTitle: 'register' })
});

router.get('/user/password', ifUserExist.redirectToDashboard, (req, res, next) => {
    res.render('user/password', { pageTitle: 'password' })
});

router.get('/user/reset/password/:token', async (req,res,next) => {
    res.render('user/passwordReset', { pageTitle: 'passwordReset' })
});

router.get('/user/reset/password/success', async (req,res,next) => {
    res.render('user/passwordChangedSuccess', { pageTitle: 'passwordReset' })
});

router.get('/user/reset/password/fail', async (req,res,next) => {
    res.render('user/passwordChangedFail', { pageTitle: 'passwordReset' })
});

router.get('/user/logout', async (req,res,next) => {
    req.session.destroy(() => res.redirect('/'));
});

router.get('/user/auth/facebook', async (req,res,next) => {

});

router.get('/user/auth/facebook/callback', async (req,res,next) => {

});

router.get('/user/auth/vk', async (req,res,next) => {

});

router.get('/user/auth/google', async (req,res,next) => {

});

router.get('/user/auth/google/callback', async (req,res,next) => {

});

// router.get('/user/auth/twitter', async (req,res,next) => {
//
// });
//
// router.get('/user/auth/twitter', async (req,res,next) => {
//
// });

module.exports = router;
