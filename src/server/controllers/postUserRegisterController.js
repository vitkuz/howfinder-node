const { api, AUTH_API_KEY } = require('../../../config/config');
const axios = require('axios');
const flashMessages = require('../../server/utils/flashMessages');

module.exports = async (req,res,next) => {
    const email = req.body.email = req.sanitize(req.body.email);
    const username = req.body.username = req.sanitize(req.body.username);
    const password = req.body.password = req.sanitize(req.body.password);

    const URL = api.users.register+`?apiKey=${AUTH_API_KEY}&lang=ru`;
    try {
        const response = await axios.post(URL, {
            email,
            username,
            password
        });
        const { user, messages, meta } = response.data;

        flashMessages(req, messages);
        console.log(user, messages, meta);

        if (user) {
            console.log('registrated user',user);
            res.redirect('/user/login')
        }
    } catch(e) {

        let { error } = _.get(e, 'response.data', {
            error: e.message
        });

        req.flash('error', error);
        console.log('/user/register',error);

        res.render('user/registerPage', {
            pageTitle: 'User register page',
            path: '/user/register',
        });
    }
}