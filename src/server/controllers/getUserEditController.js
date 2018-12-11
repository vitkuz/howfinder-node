const { api, AUTH_API_KEY } = require('../../../config/config');
const axios = require('axios');
const _ = require('lodash');
const flashMessages = require('../../server/utils/flashMessages');

module.exports = async (req, res, next) => {

    const user = req.session.user;
    const URL = api.users.get.replace('{{userId}}', user._id)+`?apiKey=${AUTH_API_KEY}&lang=ru`;

    try {
        const response = await axios.get(URL,{
            headers: {
                "x-auth" : req.header['x-auth'] || req.cookies._jwt || null
            },
        });
        const { user, messages, meta } = response.data;

        flashMessages(req, messages);

        res.render('user/editUserPage', {
            pageTitle: 'Edit user',
            path: '/user/dashboard',
            user: user
        });

    } catch (e) {
        let { error } = _.get(e, 'response.data', {
            error: e.message
        });

        req.flash(error);

        next(error);
    }
};
