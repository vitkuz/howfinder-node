module.exports = async (req,res) => {

    // req.flash('info', 'info');
    // req.flash('warning', "warning");
    // req.flash('error', "error");
    // req.flash('success', "success");

    res.render('user/loginPage', {
        pageTitle: 'User login page',
        path: '/user/login',
    });
}