const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('No user found with that id');
      }
      res.send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
