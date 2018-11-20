async function error404(req,res,next) {
    res.status(404).json({
        error: '404 Not found'
    });
}

module.exports = error404;