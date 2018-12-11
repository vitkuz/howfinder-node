const express = require('express');
const passport = require('passport');
const router = express.Router();

const ifUserExist = require('../../../utils/ifUserExist');
const ifUserNotExist = require('../../../utils/ifUserNotExist');

const sanitizeRequest = require('../../../middlewares/sanitizeRequest')

const getUserLoginController = require('../../../controllers/getUserLoginController');
const postUserLoginController = require('../../../controllers/postUserLoginController');
const getUserRegisterController = require('../../../controllers/getUserRegisterController');
const postUserRegisterController = require('../../../controllers/postUserRegisterController');
const getUserVerifyController = require('../../../controllers/getUserVerifyController');
const getUserEditController = require('../../../controllers/getUserEditController');
const postUserEditController = require('../../../controllers/postUserEditController');

router.get('/user/login',
    ifUserExist.redirectToDashboard,
    getUserLoginController);

router.post('/user/login',
    sanitizeRequest,
    postUserLoginController);

router.get('/user/register',
    ifUserExist.redirectToDashboard,
    getUserRegisterController);
router.post('/user/register',
    sanitizeRequest,
    postUserRegisterController);

router.get('/user/verify/:activationToken', getUserVerifyController);

router.get('/user', ifUserNotExist.redirectToLogin, ifUserExist.redirectToDashboard);

router.get('/user/edit',
    ifUserNotExist.redirectToLogin,
    getUserEditController);
router.post('/user/edit',
    ifUserNotExist.redirectToLogin,
    sanitizeRequest,
    postUserEditController);

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

router.get('/user/auth/facebook', passport.authenticate('facebook'));

router.get('/user/auth/facebook/callback', passport.authenticate('facebook', {
    // successRedirect: '/user/dashboard',
    failureRedirect: '/user/login'
}),(req,res) => {
    const jwtToken = req.user.jwtToken;
    res.cookie('_jwt',jwtToken, { maxAge: 900000, httpOnly: true });
    res.header('x-auth', jwtToken);
    res.redirect('/user/dashboard');
});

router.get('/user/auth/vk', async (req,res,next) => {

});

router.get('/user/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/user/auth/google/callback', passport.authenticate('google', {
    // successRedirect: '/user/dashboard',
    failureRedirect: '/user/login'
}), (req,res) => {
    const jwtToken = req.user.jwtToken;
    res.cookie('_jwt',jwtToken, { maxAge: 900000, httpOnly: true });
    res.header('x-auth', jwtToken);
    res.redirect('/user/dashboard');
});

// router.get('/user/auth/twitter', async (req,res,next) => {
//
// });
//
// router.get('/user/auth/twitter', async (req,res,next) => {
//
// });

module.exports = router;
