const { api, AUTH_API_KEY } = require('../../../config/config');
const axios = require('axios');
const _ = require('lodash');
const flashMessages = require('../../server/utils/flashMessages');

module.exports = async (req, res, next) => {

    const user = req.session.user;
    if (!user) {
        return res.render('errors/error403', {})
    }
    const URL = api.users.update.replace('{{userId}}', user._id)+`?apiKey=${AUTH_API_KEY}&lang=ru`;

    // const _id = req.body._id = req.sanitize(req.body._id);
    const username = req.body.username;
    const email = req.body.email;

    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const website = req.body.website;

    const password = req.body.password;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;

    const vk = req.body.vk;
    const facebook = req.body.facebook;
    const google = req.body.google;
    const odnoklassniki = req.body.odnoklassniki;
    const twitter = req.body.twitter;
    const youtube = req.body.youtube;
    const instagram = req.body.instagram;

    // const updatedUser = {
    //     ...(username && { username }),
    //     ...(email && { email }),
    //     ...(firstname && { firstname }),
    //     ...(lastname && { lastname }),
    //     ...(website && { website }),
    //     ...(vk && { vk }),
    //     ...(facebook && { facebook }),
    //     ...(google && { google }),
    //     ...(odnoklassniki && { odnoklassniki }),
    //     ...(twitter && { twitter }),
    //     ...(youtube && { youtube }),
    //     ...(instagram && { instagram }),
    //     ...(password && { password }),
    //     ...(confirmPassword && { confirmPassword }),
    // };

    const updatedUser = {
        username: req.body.username || '',
        email: req.body.email || '',
        firstname: req.body.firstname || '',
        lastname: req.body.lastname || '',
        website: req.body.website || '',
        password: req.body.password || '',
        newPassword: req.body.newPassword || '',
        confirmPassword: req.body.confirmPassword || '',
        vk: req.body.vk || '',
        facebook: req.body.facebook || '',
        google: req.body.google || '',
        odnoklassniki: req.body.odnoklassniki || '',
        twitter: req.body.twitter || '',
        youtube: req.body.youtube || '',
        instagram: req.body.instagram || '',
    }


    // const photo = null;
    //
    // if (photo) {
    //
    //     const AWS = require('aws-sdk');
    //     const uuid = require('uuid/v1');
    //
    //     const s3 = new AWS.S3({
    //         accessKeyId: AMAZON_CLIENT_ID,
    //         secretAccessKey: AMAZON_CLIENT_SECRET
    //     });
    //
    //     const key = `${req.session.user._id}/${uuid()}.jpeg`;
    //
    //     const photourl = await s3.getSignedUrl('putObject', {
    //         Bucket: 'howfinder',
    //         ContentType: 'image/jpeg',
    //         Key: key
    //     }, (err, url) => console.log({key, url}))
    // }
    const jwtToken = req.user.jwtToken;

    try {
        const response = await axios.put(URL, updatedUser, {
            headers: {
                "x-auth" : jwtToken
            },
        });
        const { user, messages, meta } = response.data;

        flashMessages(req, messages);
        console.log(user, messages, meta);

        res.render('user/editUserPage', {
            pageTitle: 'user/edit',
            path: '/user/edit',
            user: user
        });

    } catch (e) {
        let { error } = _.get(e, 'response.data', {
            error: e.message
        });

        req.flash(error);

        res.redirect('/user/edit');
    }
};
