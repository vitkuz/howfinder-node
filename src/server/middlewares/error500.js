async function error500(err, req, res, next) {
    console.log('error500.js',err);

    res.status(500).json({
        error: '500 Error error'
    });
}

module.exports = error500;