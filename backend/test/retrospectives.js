const chaiHttp = require("chai-http");
const chai = require("chai");

const app = require("../app");
const db = require("../models");
const mysqlhelper = require("./mysqlhelper");

const Project = db.Project;
const Retrospective = db.Retrospective;

chai.use(chaiHttp);
const expect = chai.expect;

require("./globalBefore");

describe("Retrospective", () => {
    beforeEach(() => {
        return mysqlhelper
            .truncate(Retrospective, db.sequelize)
            .then(result => {
                return mysqlhelper.truncate(Project, db.sequelize);
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
                const retrospectiveOne = {
                    name: "The Sprint A Retrospective",
                    date: Date.parse("11/30/2011"),
                    projectId: 1,
                    id: 1
                };
                return Retrospective.create(retrospectiveOne);
            });
    });

    describe("GET request on /api/projects/:projectId/retrospectives", () => {
        it("should return retrospectives", () => {
            return chai
                .request(app)
                .get("/api/projects/1/retrospectives")
                .then(res => {
                    const retros = res.body;
                    expect(retros).to.be.an("array");
                    expect(retros.length).to.eql(1);
                });
        });
    });

    describe("POST request on /api/projects/:projectId/retrospectives", () => {
        it("should create a new retrospective", () => {
            const obj = {
                name: "The Sprint B Retrospective",
                date: Date.parse("11/30/2011")
            };
            return chai
                .request(app)
                .post("/api/projects/1/retrospectives")
                .send(obj)
                .then(res => {
                    const retrospective = res.body;
                    expect(retrospective).to.be.an("object");
                    expect(retrospective.name).to.eql(obj.name);
                    return Retrospective.findById(
                        retrospective.id
                    ).then(retrievedRetrospective => {
                        expect(retrievedRetrospective.name).to.be.eql(obj.name);
                    });
                });
        });
        it("should return a 404 code if retrospective does not exist", () => {
            const obj = {
                name: "The Sprint B Retrospective"
            };
            return chai
                .request(app)
                .post("/api/projects/9/retrospectives")
                .send(obj)
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
    });

    describe("PUT request on /api/projects/:projectId/retrospectives/:retroId", () => {
        const obj = {
            name: "The Updated A Retrospective",
            date: Date.parse("11/30/2011")
        };
        it("should send a 200 status", () => {
            return chai
                .request(app)
                .put("/api/projects/1/retrospectives/1")
                .send(obj)
                .then(res => {
                    expect(res.status).to.be.eql(200);
                    return Retrospective.findById(1).then(retrospective => {
                        expect(retrospective.name).to.be.eql(
                            "The Updated A Retrospective"
                        );
                    });
                });
        });
        it("should return a 404 code if retrospective does not exist", () => {
            return chai
                .request(app)
                .put("/api/projects/1/retrospectives/9")
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
                .put("/api/projects/9/retrospectives/1")
                .send(obj)
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
    });

    describe("DELETE request on /api/projects/:projectId/retrospectives/:retroId", () => {
        it("should send a 204 status", () => {
            return chai
                .request(app)
                .delete("/api/projects/1/retrospectives/1")
                .then(res => {
                    expect(res.status).to.be.eql(204);
                    return Retrospective.findById(1).then(retrospective => {
                        expect(retrospective).to.be.null;
                    });
                });
        });
        it("should return a 404 code if retrospective does not exist", () => {
            return chai
                .request(app)
                .delete("/api/projects/1/retrospectives/9")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
        it("should return a 404 code if project does not exist", () => {
            return chai
                .request(app)
                .delete("/api/projects/9/retrospectives/1")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
    });
});
