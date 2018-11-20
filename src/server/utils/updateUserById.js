const axios = require('axios');
const User = require('../models/User');

const _ = require('lodash');
const ERRORS = require('../config/constants/errors');

async function updateUserById(req) {
    const id = req.params.id = req.sanitize(req.params.id);
    const URL = `${process.env.HOST}/api/v1/user/update/${id}`;
    try {
        const { response } = await axios.post(URL);
        const user = JSON.parse(response);
        return {error:user.error, user };
    } catch (error) {
        return { error, user:null }
    }
};

module.exports = updateUserById;
