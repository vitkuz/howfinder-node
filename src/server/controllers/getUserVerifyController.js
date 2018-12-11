const { api, AUTH_API_KEY } = require('../../../config/config');
const axios = require('axios');
const flashMessages = require('../../server/utils/flashMessages');

module.exports = async (req,res) => {
    const activationToken = req.params.activationToken = req.sanitize(req.params.activationToken);
    const URL = `${api.users.verify}?apiKey=${AUTH_API_KEY}&lang=ru`;

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
}
