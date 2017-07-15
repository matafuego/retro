const projectsController = require('../controllers').projects;
const teamsController = require('../controllers').teams;

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Retro99 API!',
  }));

  app.post('/api/projects', projectsController.create);
  app.get('/api/projects', projectsController.list);
  app.get('/api/projects/:projectId', projectsController.retrieve);
  app.put('/api/projects/:projectId', projectsController.update);
  app.delete('/api/projects/:projectId', projectsController.delete);

  app.post('/api/projects/:projectId/teams', teamsController.create);
  app.put('/api/projects/:projectId/teams/:teamId', teamsController.update);
  app.delete('/api/projects/:projectId/teams/:teamId', teamsController.delete);

  // For any other request method on teams, we're going to return "Method not allowed"
  app.all('/api/projects/:projectId/teams', (req, res) =>
    res.status(405).send({
      message: 'Method not allowed',
    }));
};
