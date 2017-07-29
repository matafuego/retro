const projectsController = require("../controllers").projects;
const teamsController = require("../controllers").teams;
const usersController = require("../controllers").users;
const retroController = require("../controllers").retrospectives;
const questionController = require("../controllers").questions;
const answerController = require("../controllers").answers;

module.exports = app => {
    app.get("/api", (req, res) =>
        res.status(200).send({
            message: "Welcome to the Retro99 API!"
        })
    );

    app.post("/api/projects", projectsController.create);
    app.get("/api/projects", projectsController.list);
    app.get("/api/projects/:projectId", projectsController.retrieve);
    app.put("/api/projects/:projectId", projectsController.update);
    app.delete("/api/projects/:projectId", projectsController.delete);

    app.post("/api/projects/:projectId/teams", teamsController.create);
    app.put("/api/projects/:projectId/teams/:teamId", teamsController.update);
    app.delete(
        "/api/projects/:projectId/teams/:teamId",
        teamsController.delete
    );

    // For any other request method on teams, we're going to return "Method not allowed"
    app.all("/api/projects/:projectId/teams", (req, res) =>
        res.status(405).send({
            message: "Method not allowed"
        })
    );

    app.post("/api/users", usersController.create);
    app.get("/api/users", usersController.list);
    app.get("/api/users/:userId", usersController.retrieve);
    app.get(
        "/api/users/username/:username",
        usersController.retrieveByUsername
    );
    app.delete("/api/users/:userId", usersController.delete);
    app.put("/api/users/:userId/projects/", usersController.asignToProject);

    app.delete(
        "/api/users/:userId/projects/:projectId",
        usersController.removeFromProject
    );

    // For any other request method on teams, we're going to return "Method not allowed"
    app.all("/api/users", (req, res) =>
        res.status(405).send({
            message: "Method not allowed"
        })
    );

    app.get("/api/projects/:projectId/retrospectives", retroController.list);
    app.post("/api/projects/:projectId/retrospectives", retroController.create);
    app.put(
        "/api/projects/:projectId/retrospectives/:retroId",
        retroController.update
    );
    app.delete(
        "/api/projects/:projectId/retrospectives/:retroId",
        retroController.delete
    );

    // For any other request method on teams, we're going to return "Method not allowed"
    app.all("/api/projects/:projectId/retrospectives", (req, res) =>
        res.status(405).send({
            message: "Method not allowed"
        })
    );

    app.post("/api/questions", questionController.create);
    app.get("/api/questions", questionController.list);
    app.get("/api/questions/:questionId", questionController.retrieve);
    app.put("/api/questions/:questionId", questionController.update);
    app.delete("/api/questions/:questionId", questionController.delete);

    app.put(
        "/api/retrospectives/:retroId/questions/",
        retroController.addQuestions
    );
    app.delete(
        "/api/retrospectives/:retroId/questions/:questionId",
        retroController.removeQuestion
    );

    app.get(
        "/api/retrospectives/:retroId/questions/:questionId/answers/",
        answerController.list
    );

    app.post(
        "/api/retrospectives/:retroId/questions/:questionId/answers/",
        answerController.answerQuestion
    );

    app.put("/api/answers/:answerId", answerController.update);

    app.delete("/api/answers/:answerId", answerController.delete);
};
