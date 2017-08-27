const projectsController = require("../controllers").projects;
const teamsController = require("../controllers").teams;
const usersController = require("../controllers").users;
const retroController = require("../controllers").retrospectives;
const questionController = require("../controllers").questions;
const answerController = require("../controllers").answers;

const auth = require("../auth/").auth;

module.exports = app => {
    app.get("/api", auth.authenticate(), (req, res) =>
        res.status(200).send({
            message: "Welcome to the Retro99 API!"
        })
    );

    app.post("/login", usersController.login);

    app.post("/api/projects", auth.authenticate(), projectsController.create);
    app.get("/api/projects", auth.authenticate(), projectsController.list);
    app.get(
        "/api/projects/:projectId",
        auth.authenticate(),
        projectsController.retrieve
    );
    app.put(
        "/api/projects/:projectId",
        auth.authenticate(),
        projectsController.update
    );
    app.delete(
        "/api/projects/:projectId",
        auth.authenticate(),
        projectsController.delete
    );

    app.post(
        "/api/projects/:projectId/teams",
        auth.authenticate(),
        teamsController.create
    );
    app.put(
        "/api/projects/:projectId/teams/:teamId",
        auth.authenticate(),
        teamsController.update
    );
    app.delete(
        "/api/projects/:projectId/teams/:teamId",
        auth.authenticate(),
        teamsController.delete
    );

    app.post("/api/users", auth.authenticate(), usersController.create);
    app.get("/api/users", auth.authenticate(), usersController.list);
    app.get(
        "/api/users/:userId",
        auth.authenticate(),
        usersController.retrieve
    );
    app.get(
        "/api/users/username/:username",
        auth.authenticate(),
        usersController.retrieveByUsername
    );
    app.delete(
        "/api/users/:userId",
        auth.authenticate(),
        usersController.delete
    );
    app.put(
        "/api/users/:userId/projects/",
        auth.authenticate(),
        usersController.asignToProject
    );

    app.delete(
        "/api/users/:userId/projects/:projectId",
        auth.authenticate(),
        usersController.removeFromProject
    );

    app.get(
        "/api/projects/:projectId/retrospectives",
        auth.authenticate(),
        retroController.list
    );
    app.post(
        "/api/projects/:projectId/retrospectives",
        auth.authenticate(),
        retroController.create
    );
    app.put(
        "/api/projects/:projectId/retrospectives/:retroId",
        auth.authenticate(),
        retroController.update
    );
    app.delete(
        "/api/projects/:projectId/retrospectives/:retroId",
        auth.authenticate(),
        retroController.delete
    );

    app.post("/api/questions", auth.authenticate(), questionController.create);
    app.get("/api/questions", auth.authenticate(), questionController.list);
    app.get(
        "/api/questions/:questionId",
        auth.authenticate(),
        questionController.retrieve
    );
    app.put(
        "/api/questions/:questionId",
        auth.authenticate(),
        questionController.update
    );
    app.delete(
        "/api/questions/:questionId",
        auth.authenticate(),
        questionController.delete
    );

    app.get(
        "/api/retrospectives/:retroId/questions/",
        auth.authenticate(),
        retroController.listQuestions
    );

    app.put(
        "/api/retrospectives/:retroId/questions/",
        auth.authenticate(),
        retroController.addQuestions
    );
    app.delete(
        "/api/retrospectives/:retroId/questions/:questionId",
        auth.authenticate(),
        retroController.removeQuestion
    );

    app.get(
        "/api/retrospectives/:retroId/questions/:questionId/answers/",
        auth.authenticate(),
        answerController.list
    );

    app.post(
        "/api/retrospectives/:retroId/questions/:questionId/answers/",
        auth.authenticate(),
        answerController.answerQuestion
    );

    app.put(
        "/api/answers/:answerId",
        auth.authenticate(),
        answerController.update
    );

    app.delete(
        "/api/answers/:answerId",
        auth.authenticate(),
        answerController.delete
    );
};
