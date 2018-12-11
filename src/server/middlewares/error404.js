async function error404(req,res,next) {
    res.status(404).render('error/error404');
}

module.exports = error404;