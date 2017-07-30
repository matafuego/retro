const chaiHttp = require("chai-http");
const chai = require("chai");

const app = require("../app");
const db = require("../models");
const mysqlhelper = require("./mysqlhelper");

const Project = db.Project;
const Retrospective = db.Retrospective;
const Question = db.Question;

chai.use(chaiHttp);
const expect = chai.expect;

require("./globalBefore");

describe("Retrospective", () => {
    beforeEach(() => {
        return db.sequelize
            .query("TRUNCATE table Questionnaire")
            .then(result => {
                return mysqlhelper.truncate(Retrospective, db.sequelize);
            })
            .then(result => {
                return mysqlhelper.truncate(Question, db.sequelize);
            })
            .then(result => {
                return mysqlhelper.truncate(Project, db.sequelize);
            })
            .then(result => {
                const question = {
                    question:
                        "What is the meaning of life, the universe, and everything?",
                    type: "textQuestion",
                    id: 1
                };
                return Question.create(question);
            })
            .then(result => {
                const question = {
                    question: "How many roads must a man walk down?",
                    type: "textQuestion",
                    id: 2
                };
                return Question.create(question);
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
            })
            .then(result => {
                const retrospectiveTen = {
                    name: "The Sprint K Retrospective",
                    date: Date.parse("09/30/2012"),
                    projectId: 1,
                    id: 10
                };
                return Retrospective.create(retrospectiveTen);
            })
            .then(retro10 => {
                return retro10.addQuestion(1);
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
                    expect(retros.length).to.eql(2);
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
    describe("PUT request on /api/retrospectives/:retroId/questions/", () => {
        it("should add a question to a retro", () => {
            const obj = [
                {
                    questionId: 1
                }
            ];
            return chai
                .request(app)
                .put("/api/retrospectives/1/questions")
                .send(obj)
                .then(res => {
                    const retro = res.body;
                    expect(retro).to.be.an("object");
                    expect(retro.name).to.eql("The Sprint A Retrospective");
                    return Retrospective.findById(retro.id).then(retrieved => {
                        expect(retrieved.name).to.be.eql(retro.name);
                        return retrieved.getQuestions().then(questions => {
                            expect(questions.length).to.be.eql(1);
                        });
                    });
                });
        });
        it("should add more than one question to a retro", () => {
            const obj = [
                {
                    questionId: 1
                },
                {
                    questionId: 2
                }
            ];
            return chai
                .request(app)
                .put("/api/retrospectives/1/questions")
                .send(obj)
                .then(res => {
                    const retro = res.body;
                    expect(retro).to.be.an("object");
                    expect(retro.name).to.eql("The Sprint A Retrospective");
                    return Retrospective.findById(retro.id).then(retrieved => {
                        expect(retrieved.name).to.be.eql(retro.name);
                        return retrieved.getQuestions().then(questions => {
                            expect(questions.length).to.be.eql(2);
                        });
                    });
                });
        });
        it("should not add any questions if one doesn't exist", () => {
            const obj = [
                {
                    questionId: 1
                },
                {
                    questionId: 9
                }
            ];
            return chai
                .request(app)
                .put("/api/retrospectives/1/questions")
                .send(obj)
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(400);
                    expect(err.message).to.eql("Bad Request");
                })
                .then(res => {
                    return Retrospective.findById(1).then(retrieved => {
                        return retrieved.getQuestions().then(questions => {
                            expect(questions.length).to.be.eql(0);
                        });
                    });
                });
        });
        it("should fail if retro does not exist", () => {
            const obj = [
                {
                    questionId: 1
                }
            ];
            return chai
                .request(app)
                .put("/api/retrospectives/9/questions")
                .send(obj)
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
    });

    describe("GET request on /api/retrospectives/:retroId/questions/", () => {
        it("should lists questions in a retro", () => {
            return chai
                .request(app)
                .get("/api/retrospectives/10/questions")
                .then(res => {
                    const questions = res.body;
                    expect(questions).to.be.an("array");
                    expect(questions.length).to.eql(1);
                });
        });
        it("should fail if retro does not exist", () => {
            return chai
                .request(app)
                .get("/api/retrospectives/9/questions")
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

    describe("DELETE request on /api/retrospectives/:retroId/questions/:questionId", () => {
        it("should remove a question from a retro", () => {
            return chai
                .request(app)
                .delete("/api/retrospectives/10/questions/1")
                .then(res => {
                    expect(res.status).to.be.eql(204);
                    return Retrospective.findById(10);
                })
                .then(retro10 => {
                    return retro10.getQuestions();
                })
                .then(questions => {
                    expect(questions.length).to.be.eql(0);
                })
                .then(Question.findById(1))
                .then(question => {
                    expect(question).to.not.be.null;
                });
        });
        it("should not remove the question if it doesn't exist", () => {
            return chai
                .request(app)
                .delete("/api/retrospectives/10/questions/9")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                })
                .then(res => {
                    return Retrospective.findById(10).then(retrieved => {
                        return retrieved.getQuestions().then(questions => {
                            expect(questions.length).to.be.eql(1);
                        });
                    });
                });
        });
        it("should fail if retro does not exist", () => {
            return chai
                .request(app)
                .delete("/api/retrospectives/9/questions/1")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
        it("should fail if question does not belong to the retro", () => {
            return chai
                .request(app)
                .delete("/api/retrospectives/10/questions/2")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
    });
});
