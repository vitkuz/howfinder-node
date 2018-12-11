const { api, AUTH_API_KEY } = require('../../../config/config');
const axios = require('axios');
const flashMessages = require('../../server/utils/flashMessages');

module.exports = async (req,res,next) => {

    const email = req.body.email = req.sanitize(req.body.email);
    const password = req.body.password = req.sanitize(req.body.password);

    const URL = api.users.login+`?apiKey=${AUTH_API_KEY}&lang=ru`;
    try {
        const response = await axios.post(URL, {email, password});
        const { user, messages, jwtToken } = response.data;
        if (user) {

            res.cookie('_jwt',jwtToken, { maxAge: 900000, httpOnly: true });
            res.header('x-auth', jwtToken);
            req.session.user = user;
            req.session.jwtToken = jwtToken;

            flashMessages(req, messages);
            req.flash('info', 'Seems like login');

            res.redirect('/user/dashboard')
        }

    } catch(e) {
        let { error } = _.get(e, 'response.data', {
            error: e.message
        });
        req.flash('error', error);

        res.render('user/loginPage', {
            pageTitle: 'User login page',
            path: '/user/login'
        });
    }
}