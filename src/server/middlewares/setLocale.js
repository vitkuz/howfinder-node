module.exports = (req,res,next) => {
    const lang = req.cookies.lang || req.acceptsLanguages('ru', 'en') || 'en';
    if (!req.cookies.lang) res.cookie('lang', lang);
    req.locale = lang;
    next();
}