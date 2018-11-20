module.exports = function isAuthorized(roles) {
    return function (req,res,next) {
        console.log('isAuthorized && RolesMiddleware applied');

        if(req.user && req.user.roles) {

            let hasRole = roles.map(role => {
                return req.user.roles.includes(role);
            });

            hasRole = hasRole.some(result => result === true);

            if (hasRole) {
                next()
            } else {
                return res.status(403).json({
                    error: 'You don\'t have permission to access this resource'
                })
            }

        } else {
            return res.status(403).json({
                error: 'You don\'t have permission to access this resource'
            })
        }
    };
};
