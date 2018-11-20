module.exports = function (req,res,next) {

    //input(type="hidden", name="_csrf", value="#{csrftoken}")
    res.locals.csrftoken = req.session._csrf;
    next();
};