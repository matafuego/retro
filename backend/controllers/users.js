const User = require('../models').User;
const Project = require('../models').Project;
const Team = require('../models').Team;

module.exports = {
  create(req, res, next) {
    return User
      .findOne({
        where: { username: req.body.username },
      })
      .then(user => {
        if (!user) {
          return User
            .create({
              username: req.body.username,
            })
            .then(user => res.status(201).send(user))
            .catch(error => next(error));
        }
        return res.status(409).send({
          message: 'User already exists',
        });
      })
      .catch(error => next(error));
  },

  list(req, res, next) {
    return User
      .findAll({
        include: [{
          model: Project,
          as: 'projects',
        }],
      })
      .then(users => res.status(200).send(users))
      .catch(error => next(error));
  },

  retrieveByUsername(req, res, next) {
    return User
      .findOne({
        where: { username: req.params.username },
        include: [{
          model: Project,
          as: 'projects',
        }],
      })
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'User not found',
          });
        }
        return res.status(200).send(user);
      })
      .catch(error => next(error));
  },

  retrieve(req, res, next) {
    return User
      .findById(req.params.userId, {
        include: [{
          model: Project,
          as: 'projects',
        }],
      })
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'User not found',
          });
        }
        return res.status(200).send(user);
      })
      .catch(error => next(error));
  },

  delete(req, res, next) {
    return User
      .findById(req.params.userId)
      .then(user => {
        if (!user) {
          return res.status(400).send({
            message: 'User not found',
          });
        }
        return user
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => next(error));
      })
      .catch(error => next(error));
  },

};