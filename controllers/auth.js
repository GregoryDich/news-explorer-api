const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.registerUser = (req, res, next) => {
  let email;
  if (!validator.isEmail(req.body.email)) {
    email = null;
  } else { email = req.body.email; }
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name, password: hash, email,
    }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        email: user.email,
        _id: user._id.valueOf(),
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {
          expiresIn: '7d',
        },
      );
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};
