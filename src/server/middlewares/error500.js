async function error500(err, req, res, next) {
    console.log('error500.js',err);
    res.status(500).render('error/error500');
}

module.exports = error500;