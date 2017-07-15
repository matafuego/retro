const projectsController = require('../controllers').projects;

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Retro99 API!',
  }));

  app.post('/api/projects', projectsController.create);
};
