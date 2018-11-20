const appRoutes = require('../routes/app/index');

module.exports = function (app) {

    app.use('/', appRoutes);
};
