const User = require('../models').User;
const Project = require('../models').Project;
const Team = require('../models').Team;
const Errors = require('../errors/errors');
const sequelize = require('../models').sequelize;

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
        throw Errors.conflict('userExists', 'User already exists');
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
          throw Errors.notFound('userNotFound', 'User not found');
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
          throw Errors.notFound('userNotFound', 'User not found');
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
          throw Errors.notFound('userNotFound', 'User not found');
        }
        return user
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => next(error));
      })
      .catch(error => next(error));
  },

  asignToProject(req, res, next) {
    return sequelize.transaction().then(function (t) {
      return User.findById(req.params.userId, { transaction: t })
        .then(user => {
          if (!user) {
            throw Errors.notFound('userNotFound', 'User not found');
          }

          var promises = [];
          var projects = req.body;
          projects.forEach((project) =>
            promises.push(assignUserToProject(user, project.projectId, t))
          );

          return sequelize.Promise.all(promises);
        })
        .then(result => {
          return User.findById(req.params.userId, {
            include: [{
              model: Project,
              as: 'projects',
            }],
            transaction: t,
          })
        })
        .then(user => {
          if (!user) {
            throw Errors.notFound('userNotFound', 'User not found');
          }
          return res.status(200).send(user);
        })
        .then(result => { return t.commit(); })
        .catch(error => { t.rollback(); next(error); });
    })
      .catch(error => next(error))
  },
};

function assignUserToProject(user, projectId, t) {
  return Project
    .findById(projectId, { transaction: t })
    .then(project => {
      if (!project) {
        throw Errors.badRequest('projectNotFound', 'Project ' + projectId + ' does not exist');
      }
      return user.addProject(project, { transaction: t });
    });
}