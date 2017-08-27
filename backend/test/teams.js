const chaiHttp = require("chai-http");
const chai = require("chai");

const app = require("../app");
const db = require("../models");
const mysqlhelper = require("./mysqlhelper");
const constants = require("./constants");

const Project = db.Project;
const Team = db.Team;
const User = db.User;

chai.use(chaiHttp);
const expect = chai.expect;

require("./globalBefore");

describe("Team", () => {
    beforeEach(() => {
        return mysqlhelper
            .truncate(Team, db.sequelize)
            .then(result => {
                return mysqlhelper.truncate(Project, db.sequelize);
            })
            .then(() => {
                return mysqlhelper.truncate(User, db.sequelize);
            })
            .then(() => {
                const userOne = {
                    username: "oneUser",
                    email: "one@mail.com",
                    name: "One User Name",
                    password: "123123",
                    id: 1
                };
                return User.create(userOne);
            })
            .then(result => {
                const projectOne = {
                    name: "myFirstProject",
                    id: 1
                };
                return Project.create(projectOne);
            })
            .then(result => {
                const projectTwo = {
                    name: "mySecondProject",
                    id: 2
                };
                return Project.create(projectTwo);
            })
            .then(result => {
                const teamOne = {
                    name: "The A Team",
                    projectId: 1,
                    id: 1
                };
                return Team.create(teamOne);
            });
    });

    describe("GET request on /api/projects/:id", () => {
        it("should return teams", () => {
            return chai
                .request(app)
                .get("/api/projects/1")
                .set("Authorization", constants.token)
                .then(res => {
                    const project = res.body;
                    expect(project).to.be.an("object");
                    expect(project.name).to.eql("myFirstProject");
                    expect(project.teams).to.be.an("array");
                    expect(project.teams.length).to.eql(1);
                });
        });
    });

    describe("POST request on /api/projects/:projectId/teams", () => {
        it("should create a new team", () => {
            const obj = {
                name: "The B Team"
            };
            return chai
                .request(app)
                .post("/api/projects/1/teams")
                .set("Authorization", constants.token)
                .send(obj)
                .then(res => {
                    const team = res.body;
                    expect(team).to.be.an("object");
                    expect(team.name).to.eql("The B Team");
                    return Team.findById(team.id).then(retrievedTeam => {
                        expect(retrievedTeam.name).to.be.eql("The B Team");
                    });
                });
        });
        it("should return a 404 code if team does not exist", () => {
            const obj = {
                name: "The B Team"
            };
            return chai
                .request(app)
                .post("/api/projects/9/teams")
                .set("Authorization", constants.token)
                .send(obj)
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
    });

    describe("PUT request on /api/projects/:projectId/teams/:teamId", () => {
        const obj = {
            name: "The Updated A Team"
        };
        it("should send a 200 status", () => {
            return chai
                .request(app)
                .put("/api/projects/1/teams/1")
                .set("Authorization", constants.token)
                .send(obj)
                .then(res => {
                    expect(res.status).to.be.eql(200);
                    return Team.findById(1).then(team => {
                        expect(team.name).to.be.eql("The Updated A Team");
                    });
                });
        });
        it("should return a 404 code if team does not exist", () => {
            return chai
                .request(app)
                .put("/api/projects/1/teams/9")
                .set("Authorization", constants.token)
                .send(obj)
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
        it("should return a 404 code if project does not exist", () => {
            return chai
                .request(app)
                .put("/api/projects/9/teams/1")
                .set("Authorization", constants.token)
                .send(obj)
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
    });

    describe("DELETE request on /api/projects/:projectId/teams/:teamId", () => {
        it("should send a 204 status", () => {
            return chai
                .request(app)
                .delete("/api/projects/1/teams/1")
                .set("Authorization", constants.token)
                .then(res => {
                    expect(res.status).to.be.eql(204);
                    return Team.findById(1).then(team => {
                        expect(team).to.be.null;
                    });
                });
        });
        it("should return a 404 code if team does not exist", () => {
            return chai
                .request(app)
                .delete("/api/projects/1/teams/9")
                .set("Authorization", constants.token)
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
        it("should return a 404 code if project does not exist", () => {
            return chai
                .request(app)
                .delete("/api/projects/9/teams/1")
                .set("Authorization", constants.token)
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
    });
});
