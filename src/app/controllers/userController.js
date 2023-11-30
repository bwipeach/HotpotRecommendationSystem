const User = require('../models/User');
const { mongooseToObject } = require('../../util/mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const salt = 10;
const cookieParser = require('cookie-parser');
class userController {
    //[GET] user/register
    register(req, res, next) {
        res.render('user/register');
    }
    //[POST] /user/register1
    async register1(req, res, next) {
        const name = await req.body.name;
        const email = await req.body.email;
        const password = await bcrypt.hash(req.body.password, salt);

        await User.findOne({
            email: email
        })
            .then((data) => {
                if (data) {
                    res.json('Email da ton tai');
                } else {
                    return User.create({
                        name: name,
                        email: email,
                        password: password
                    });
                }
            })
            .then((data) => {
                // res.json('Tao tai khoan thanh cong');
                res.redirect('login');
            })
            .catch((err) => {
                // res.status(500).json('Tao tai khoan that bai');
                res.redirect('register');
            });
    }

    //[GET] user/login
    login(req, res, next) {
        // localStorage.removeItem('token');
        res.render('user/login');
    }
    //[POST] /user/login1
    async login1(req, res, next) {
        const user = await User.findOne({
            email: req.body.email
            // password: password
        });
        if (!user)
            return res.status(500).json('Tai khoan hoac mat khau khong dung');
        const checkPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!checkPassword)
            return res.status(422).send('Tai khoan hoac mat khau khong dung');

        const token = jwt.sign(
            { _id: user._id, IsAdmin: user.IsAdmin },
            '${process.env.ACCESS_TOKEN_SECRET}',
            { expiresIn: '15m' }
        );
        res.cookie('auth-token', token);
        res.redirect('/');
    }

    //[GET] /user/logout
    logout(req, res, next) {
        res.clearCookie('auth-token');
        res.redirect('/user/login');
    }
}

module.exports = new userController();