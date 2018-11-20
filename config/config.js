const path = require('path');

const usersApiHost = 'https://vast-brook-68803.herokuapp.com';
// const usersApiHost = 'https://vast-brook-68803.herokuapp.com';

const staticPath = path.join(__dirname,'..','public'); //@todo move to config file
const viewsPath = path.join(__dirname,'..','src','server','views'); //@todo move to config file

console.log(staticPath);
console.log(viewsPath);

const config  = {
    all: {
        ENV: process.env.NODE_ENV,
        PORT: process.env.PORT || 4000,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
        AUTH_API_KEY: process.env.AUTH_API_KEY,
        VERIFY_USERS: process.env.VERIFY_USERS,
        JWT_SECRET: process.env.JWT_SECRET,
        staticPath,
        viewsPath,
        api: {
            users: {
                login: usersApiHost + '/api/v1/user/login',
                register: usersApiHost + '/api/v1/user/register',
                sendPassword: usersApiHost + '/api/v1/user/send/password',
                resetPassword: usersApiHost + '/api/v1/user/reset/password',
                verify: usersApiHost + '/api/v1/user/verify',
                create: usersApiHost + '/api/v1/users',
                update: usersApiHost + '/api/v1/users/{{userId}}',
                delete: usersApiHost + '/api/v1/users/{{userId}}',
                get: usersApiHost + '/api/v1/users/{{userId}}',
            }
        }
    },
    development: {
        MONGO_URI: process.env.MONGO_URI,
        SENDGRID_KEY: process.env.SENDGRID_KEY
    },
    staging: {
        MONGO_URI: process.env.MONGO_URI,
        SENDGRID_KEY: process.env.SENDGRID_KEY
    },
    testing: {

    }
};

const final = Object.assign({}, config.all, config[process.env.NODE_ENV]);
console.log(final);
module.exports = final;