const localization = require('../../../config/localization');

module.exports = (req,res,next) => {
    const lang = req.query.lang || req.body.lang || req.params.lang || 'en';
    req.locale = lang;
    localization.setLocale(lang);
    req.localization = localization;
    next();
}