const axios = require('axios');

const _ = require('lodash');
const ERRORS = require('../../../config/constants/errors');

async function verifyUserByEmail(req) {
    const activationToken = req.params.activationToken = req.sanitize(req.params.activationToken);
    const URL = `${process.env.HOST}/api/v1/user/verify/${activationToken}`;
    try {
        const { response } = await axios.get(URL);
        const user = JSON.parse(response);
        return {error:user.error, user };
    } catch (error) {
        return { error, user:null }
    }
};

module.exports = verifyUserByEmail;
