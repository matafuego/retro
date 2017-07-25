const chaiHttp = require("chai-http");
const chai = require("chai");

const app = require("../app");
const db = require("../models");
const mysqlhelper = require("./mysqlhelper");

const Question = db.Question;

chai.use(chaiHttp);
const expect = chai.expect;

require("./globalBefore");

describe("Question", () => {
    beforeEach(() => {
        return mysqlhelper.truncate(Question, db.sequelize).then(result => {
            const testObject = {
                question:
                    "What is the meaning of life, the universe, and everything?",
                type: "textQuestion",
                id: 1
            };
            return Question.create(testObject);
        });
    });

    describe("GET request on /api/questions", () => {
        it("should be json", () => {
            return chai.request(app).get("/api/questions").then(res => {
                expect(res.type).to.eql("application/json");
            });
        });
        it("should return a 200 status", () => {
            return chai.request(app).get("/api/questions").then(res => {
                expect(res.status).to.eql(200);
            });
        });
    });

    describe("GET request on /api/questions/:id", () => {
        it("should be a question object", () => {
            return chai.request(app).get("/api/questions/1").then(res => {
                const question = res.body;
                expect(question).to.be.an("object");
                expect(question.question).to.eql(
                    "What is the meaning of life, the universe, and everything?"
                );
                expect(question.type).to.eql("textQuestion");
            });
        });
        it("should return a 404 code", () => {
            return chai
                .request(app)
                .get("/api/questions/2")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
    });

    describe("POST request on /api/questions", () => {
        it("should create a new question", () => {
            const obj = {
                question: "How many roads must a man walk down?",
                type: "textQuestion"
            };
            return chai
                .request(app)
                .post("/api/questions")
                .send(obj)
                .then(res => {
                    const question = res.body;
                    expect(question).to.be.an("object");
                    expect(question.question).to.eql(obj.question);
                    expect(question.type).to.eql(obj.type);
                    return Question.findById(
                        question.id
                    ).then(retrievedQuestion => {
                        expect(retrievedQuestion.question).to.be.eql(
                            obj.question
                        );
                    });
                });
        });
    });

    describe("PUT request on /api/questions/:id", () => {
        const obj = {
            question: "What do you get if you multiply six by nine?"
        };
        it("should send a 200 status", () => {
            return chai
                .request(app)
                .put("/api/questions/1")
                .send(obj)
                .then(res => {
                    expect(res.status).to.be.eql(200);
                    return Question.findById(1).then(retrievedQuestion => {
                        expect(retrievedQuestion.question).to.be.eql(
                            obj.question
                        );
                        expect(retrievedQuestion.type).to.eql("textQuestion");
                    });
                });
        });
        it("should return a 404 code", () => {
            return chai
                .request(app)
                .put("/api/questions/2")
                .send(obj)
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
    });

    describe("DELETE request on /api/questions/:id", () => {
        it("should send a 204 status", () => {
            return chai.request(app).delete("/api/questions/1").then(res => {
                expect(res.status).to.be.eql(204);
                return Question.findById(1).then(question => {
                    expect(question).to.be.null;
                });
            });
        });
        it("should return a 404 code", () => {
            return chai
                .request(app)
                .delete("/api/questions/2")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
    });
});
