const express = require('express');
const _ = require('lodash');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');

const ifUserExist = require('../../../utils/ifUserExist');
const ifUserNotExist = require('../../../utils/ifUserNotExist');
const verifyUserByEmail = require('../../../utils/verifyUserByEmail');

const { api, AUTH_API_KEY } = require('../../../../../config/config');


router.get('/user/login', async (req,res,next) => {
    res.render('user/loginPage', {
        pageTitle: 'User login page',
        path: '/user/login',
        messages:{
            errors:[]
        }
    });
});

router.post('/user/login', async (req,res,next) => {

    const email = req.body.email = req.sanitize(req.body.email);
    const password = req.body.password = req.sanitize(req.body.password);

    const URL = api.users.login+`?apiKey=${AUTH_API_KEY}`;
    try {
        const response = await axios.post(URL, {email, password});
        const { data: user } = response;
        if (user) {
            const jwtToken = response.headers['x-auth'] ? response.headers['x-auth'] : null;
            if (jwtToken) {
                res.cookie('_jwt',jwtToken, { maxAge: 900000, httpOnly: true });
                res.header('x-auth', jwtToken);
            }
            req.session.user = user;
            res.redirect('/user/dashboard')
        }

    } catch(e) {
        const { error } = e.response.data;

        res.render('user/loginPage', {
            pageTitle: 'User login page',
            path: '/user/login',
            messages: {
                errors: [
                    error
                ]
            }
        });
        // console.log('userRouter.js',e);
    }

});

router.get('/user/register', async (req,res,next) => {
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
        const response = await axios.post(URL, {email, username, password});
        const { data: user } = response;
        if (user) {
            console.log('registrated user',user);
            res.redirect('/user/login')
        }
    } catch(e) {

        const { error } = e.response.data;

        res.render('user/registerPage', {
            pageTitle: 'User register page',
            path: '/user/register',
            messages: {
                errors: [
                    error
                ]
            }
        });
    }
});

router.get('/user/verify/:activationToken', async (req,res,next) => {
    const activationToken = req.params.activationToken = req.sanitize(req.params.activationToken);
    const URL = api.users.verify+`?apiKey=${AUTH_API_KEY}`;

    try {
        const response = await axios.post(URL, { activationToken });
        const { data: user } = response;
        if (user) {
            console.log('user verified',user);
            res.redirect('/user/login')
        }
    } catch(e) {
        const { error } = e.response.data;
        console.log(error);
        res.redirect('/user/login')
    }
});



router.get('/user', ifUserNotExist.redirectToLogin, async (req, res, next) => {

    const user = req.session.user;
    const URL = api.users.get.replace('{{userId}}', user._id);

    try {
        const rawApiResponse = await axios.get(URL);
        const { data } = rawApiResponse;

        res.redirect('/user/dashboard', {
            pageTitle: 'user/edit',
            path: '/user/dashboard',
            user: data
        });

    } catch (error) {
        return res.render('admin/500error', { error })
    }


});

router.get('/user/edit', ifUserNotExist.redirectToLogin, async (req, res, next) => {

    const user = req.session.user;
    const URL = api.users.get.replace('{{userId}}', user._id);

    try {
        const rawApiResponse = await axios.get(URL);
        const { data } = rawApiResponse;

        res.render('user/editUserPage', {
            pageTitle: 'user/edit',
            path: '/user/dashboard',
            user: data
        });

    } catch (error) {
        return res.render('admin/500error', { error })
    }
});

router.post('/user/edit', async (req, res, next) => {

    const _id = req.body._id = req.sanitize(req.body._id);
    const username = req.body.username = req.sanitize(req.body.username);
    const email = req.body.email = req.sanitize(req.body.email);

    const URL = api.users.update.replace('{{userId}}', id);

    try {
        const rawApiResponse = await axios.put(URL, req.body, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const { data } = rawApiResponse;
        if (data.error) return res.render('admin/500error', { error: data.error });
        res.render('admin/editUser', data );

    } catch (error) {
        return res.render('admin/500error', { error })
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

router.get('/user/login', ifUserExist.redirectToUserDashboard, (req, res, next) => {
    res.render('user/login', { pageTitle: 'login' })
});

router.get('/user/register', ifUserExist.redirectToUserDashboard, (req, res, next) => {
    res.render('user/register', { pageTitle: 'register' })
});

router.get('/user/password', ifUserExist.redirectToUserDashboard, (req, res, next) => {
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

module.exports = router;
