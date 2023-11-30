const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('../app/models/User');
const verifyToken = (req, res, next) => {
    const token = req.cookies['auth-token'];

    if (!token) {
        return res.redirect('/user/login');
    }

    try {
        const verified = jwt.verify(
            token,
            '${process.env.ACCESS_TOKEN_SECRET}'
        );
        User.findOne({ _id: verified._id })
            .then((user) => {
                if (!user) {
                    return res.redirect('/user/login');
                }
                req.user = user;
                next();
            })
            .catch((err) => {
                console.error('Error: ', err);
                return res.redirect('/user/login');
            });
    } catch (err) {
        return res.redirect('/user/login');
    }
};
module.exports = verifyToken;
