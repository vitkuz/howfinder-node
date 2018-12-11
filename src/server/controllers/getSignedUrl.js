const AWS = require('aws-sdk');
const uuid = require('uuid/v1');

const { AMAZON_CLIENT_ID, AMAZON_CLIENT_SECRET } = require('../../../config/config');

const s3 = new AWS.S3({
    accessKeyId: AMAZON_CLIENT_ID,
    secretAccessKey: AMAZON_CLIENT_SECRET
});

module.exports = async (req, res) => {

    // const key = `${req.session.user._id}/${uuid()}.jpeg`;
    const key = `24234234234423/${uuid()}.jpeg`;

    s3.getSignedUrl('putObject', {
        Bucket: 'howfinder',
        ContentType: 'image/jpeg',
        Key: key
    }, (err, url) => {
        console.log(err, url, key);
        res.json({
            url,
            key
        })
    })
}