const Project = require('../models').Project;
const Team = require('../models').Team;
const Errors = require('../errors/errors');

module.exports = {
  create(req, res, next) {
    return Project
      .create({
        name: req.body.name,
      })
      .then(project => res.status(201).send(project))
      .catch(error => next(error));
  },

  list(req, res, next) {
    return Project
      .findAll({
        include: [{
          model: Team,
          as: 'teams',
        }],
      })
      .then(projects => res.status(200).send(projects))
      .catch(error => next(error));
  },

  retrieve(req, res, next) {
    return Project
      .findById(req.params.projectId, {
        include: [{
          model: Team,
          as: 'teams',
        }],
      })
      .then(project => {
        if (!project) {
          throw Errors.notFound('projectNotFound', 'Project not found');
        }
        return res.status(200).send(project);
      })
      .catch(error => next(error));
  },

  update(req, res, next) {
    return Project
      .findById(req.params.projectId, {
        include: [{
          model: Team,
          as: 'teams',
        }],
      })
      .then(project => {
        if (!project) {
          throw Errors.notFound('projectNotFound', 'Project not found');
        }
        return project
          .update({
            name: req.body.name || project.name,
          })
          .then(() => res.status(200).send(project))  // Send back the updated project.
          .catch((error) => next(error));
      })
      .catch((error) => next(error));
  },

  delete(req, res, next) {
    return Project
      .findById(req.params.projectId)
      .then(project => {
        if (!project) {
          throw Errors.notFound('projectNotFound', 'Project not found');
        }
        return project
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => next(error));
      })
      .catch(error => next(error));
  },

};