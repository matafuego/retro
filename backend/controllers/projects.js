const Project = require('../models').Project;

module.exports = {
  create(req, res) {
    return Project
      .create({
        name: req.body.name,
      })
      .then(project => res.status(201).send(project))
      .catch(error => res.status(400).send(error));
  },
};