const chaiHttp = require("chai-http");
const chai = require("chai");

const app = require("../app");
const db = require("../models");
const mysqlhelper = require("./mysqlhelper");

const Project = db.Project;
const Retrospective = db.Retrospective;
const Question = db.Question;
const User = db.User;
const Answer = db.Answer;

chai.use(chaiHttp);
const expect = chai.expect;

require("./globalBefore");

describe("Answer", () => {
    beforeEach(() => {
        return db.sequelize
            .query("TRUNCATE table Questionnaire")
            .then(result => {
                return mysqlhelper.truncate(Answer, db.sequelize);
            })
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
                return mysqlhelper.truncate(User, db.sequelize);
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
                const question = {
                    question: "What is nine times seven?",
                    type: "textQuestion",
                    id: 3
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
                return db.sequelize.Promise.all([
                    retro10.addQuestion(1),
                    retro10.addQuestion(2)
                ]);
            })
            .then(result => {
                const userOne = {
                    username: "oneUser",
                    email: "one@mail.com",
                    name: "One User Name",
                    id: 1
                };
                return User.create(userOne);
            })
            .then(result => {
                const userTwo = {
                    username: "twoUser",
                    email: "two@mail.com",
                    name: "Two User Name",
                    id: 2
                };
                return User.create(userTwo);
            })
            .then(result => {
                const answerOne = {
                    answer: "Forty-Two",
                    retroId: 10,
                    questionId: 1,
                    userId: 1
                };
                return Answer.create(answerOne);
            })
            .then(result => {
                const answerTwo = {
                    answer: "Forty and 2",
                    retroId: 10,
                    questionId: 1,
                    userId: 2
                };
                return Answer.create(answerTwo);
            });
    });

    describe("GET request on /api/retrospectives/:retroId/questions/:questionId/answers/", () => {
        it("should return one answer", () => {
            return chai
                .request(app)
                .get("/api/retrospectives/10/questions/1/answers")
                .then(res => {
                    const retros = res.body;
                    expect(retros).to.be.an("array");
                    expect(retros.length).to.eql(2);
                });
        });
        it("should filter by user", () => {
            return chai
                .request(app)
                .get("/api/retrospectives/10/questions/1/answers?users=1")
                .then(res => {
                    const retros = res.body;
                    expect(retros).to.be.an("array");
                    expect(retros.length).to.eql(1);
                });
        });
        it("should filter by multiple users", () => {
            return chai
                .request(app)
                .get(
                    "/api/retrospectives/10/questions/1/answers?users=1&users=2&users=3"
                )
                .then(res => {
                    const retros = res.body;
                    expect(retros).to.be.an("array");
                    expect(retros.length).to.eql(2);
                });
        });

        it("should return a 404 code if retrospective does not exist", () => {
            return chai
                .request(app)
                .get("/api/retrospectives/9/questions/1/answers")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
        it("should return a 404 code if question does not exist", () => {
            return chai
                .request(app)
                .get("/api/retrospectives/10/questions/9/answers")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
        it("should return a 404 code if question does not belong to retrospective", () => {
            return chai
                .request(app)
                .get("/api/retrospectives/10/questions/3/answers")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
    });

    describe("POST request on /api/retrospectives/:retroId/questions/:questionId/answers/", () => {
        it("should create a new answer", () => {
            const obj = {
                userId: 1,
                answer: "The number 42"
            };
            return chai
                .request(app)
                .post("/api/retrospectives/10/questions/2/answers")
                .send(obj)
                .then(res => {
                    const answer = res.body;
                    expect(answer).to.be.an("object");
                    expect(answer.answer).to.eql(obj.answer);
                    return Answer.findById(answer.id).then(retrieved => {
                        expect(retrieved.answer).to.be.eql(obj.answer);
                    });
                });
        });
        it("should return conflict if an answer exists for the same user, question, and retrospective", () => {
            const obj = {
                userId: 1,
                answer: "The number 42"
            };
            return chai
                .request(app)
                .post("/api/retrospectives/10/questions/1/answers")
                .send(obj)
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(409);
                    expect(err.message).to.eql("Conflict");
                });
        });
        it("should return a 404 code if retrospective does not exist", () => {
            const obj = {
                userId: 1,
                answer: "The number 42"
            };
            return chai
                .request(app)
                .post("/api/retrospectives/9/questions/1/answers")
                .send(obj)
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
        it("should return a 404 code if question does not exist", () => {
            const obj = {
                userId: 1,
                answer: "The number 42"
            };
            return chai
                .request(app)
                .post("/api/retrospectives/10/questions/9/answers")
                .send(obj)
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
        it("should return a 404 code if question does not belong to retrospective", () => {
            const obj = {
                userId: 1,
                answer: "The number 42"
            };
            return chai
                .request(app)
                .post("/api/retrospectives/10/questions/3/answers")
                .send(obj)
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
        it("should return a 400 code if user does not exist", () => {
            const obj = {
                userId: 9,
                answer: "The number 42"
            };
            return chai
                .request(app)
                .post("/api/retrospectives/10/questions/1/answers")
                .send(obj)
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(400);
                    expect(err.message).to.eql("Bad Request");
                });
        });
    });

    describe("PUT request on /api/answers/:answerId", () => {
        const obj = {
            answer: "42"
        };
        it("should send a 200 status", () => {
            return chai
                .request(app)
                .put("/api/answers/1")
                .send(obj)
                .then(res => {
                    expect(res.status).to.be.eql(200);
                    return Answer.findById(1).then(answer => {
                        expect(answer.answer).to.be.eql(obj.answer);
                    });
                });
        });
        it("should return a 404 code if answer does not exist", () => {
            return chai
                .request(app)
                .put("/api/answers/9")
                .send(obj)
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
    });

    describe("DELETE request on /api/answers/:answerId", () => {
        it("should send a 204 status", () => {
            return chai.request(app).delete("/api/answers/1").then(res => {
                expect(res.status).to.be.eql(204);
                return Answer.findById(1).then(answer => {
                    expect(answer).to.be.null;
                });
            });
        });
        it("should return a 404 code if answer does not exist", () => {
            return chai
                .request(app)
                .delete("/api/answers/9")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
    });
});
