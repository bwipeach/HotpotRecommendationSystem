const User = require('../app/models/User');
const ROLE_LIST = require('../app/models/Role_list');

const verifyRole = (allowedRole) => {
    return (req, res, next) => {
        User.findOne({ name: req.user.name })
            .then((user) => {
                if (user === null || user.IsAdmin !== allowedRole)
                    // return res.sendStatus(403);
                    return res
                        .status(422)
                        .send('Ban khong duoc quyen truy cap');
                next();
            })
            .catch((error) => {
                console.error('Error: ', error);
                res.sendStatus(500);
            });
    };
};

module.exports = verifyRole;
