const chaiHttp = require("chai-http");
const chai = require("chai");

const app = require("../app");
const db = require("../models");
const mysqlhelper = require("./mysqlhelper");

const User = db.User;
const encrypt = require("../auth/encrypt");
const constants = require("./constants");

chai.use(chaiHttp);
const expect = chai.expect;

require("./globalBefore");

describe("Auth", () => {
    beforeEach(() => {
        return mysqlhelper
            .truncate(User, db.sequelize)
            .then(() => {
                return encrypt.hashPassword("123123");
            })
            .then(hashedPassword => {
                const userOne = {
                    username: "oneUser",
                    email: "one@mail.com",
                    name: "One User Name",
                    password: hashedPassword,
                    id: 1
                };
                return User.create(userOne);
            });
    });

    describe("GET request on /api/", () => {
        it("should give unauthorized if there's no Authentication header", () => {
            return chai
                .request(app)
                .get("/api/")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("should give unauthorized if there's an invalid Authentication header", () => {
            return chai
                .request(app)
                .get("/api/")
                .set(
                    "Authorization",
                    "jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImlhdCI6MTUwMzc4MTYyNH0.XoNVRhcsCmISvxE_zctaWMNcoFfCgmB1rJKs4uQ_QrM"
                )
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("should return 200 if there's a valid Authentication header", () => {
            return chai
                .request(app)
                .get("/api/")
                .set("Authorization", constants.token)
                .then(res => {
                    expect(res.status).to.eql(200);
                });
        });
    });

    describe("POST request on /login", () => {
        it("should give unauthorized if user doesn't exist", () => {
            const obj = {
                username: "fakeUser",
                password: "123123"
            };
            return chai
                .request(app)
                .post("/login")
                .send(obj)
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("should give unauthorized if password doesn't match", () => {
            const obj = {
                username: "oneUser",
                password: "123124"
            };
            return chai
                .request(app)
                .post("/login")
                .send(obj)
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("should return token if successful", () => {
            const obj = {
                username: "oneUser",
                password: "123123"
            };
            return chai.request(app).post("/login").send(obj).then(res => {
                expect(res.status).to.eql(200);
                const login = res.body;
                expect(login).to.be.an("object");
                expect(login.message).to.eql("login successful");
                expect(login.token).to.be.not.null;
            });
        });
    });

    describe("Should give unauthorized if there's no Authentication header", () => {
        it("POST /api/projects", () => {
            return chai
                .request(app)
                .post("/api/projects")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("GET /api/projects", () => {
            return chai
                .request(app)
                .get("/api/projects")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("GET /api/projects/1", () => {
            return chai
                .request(app)
                .get("/api/projects/1")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("PUT /api/projects/1", () => {
            return chai
                .request(app)
                .put("/api/projects/1")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("DELETE /api/projects/1 sshould give unauthorized if there's no Authentication header", () => {
            return chai
                .request(app)
                .delete("/api/projects/1")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("POST /api/projects/1/teams", () => {
            return chai
                .request(app)
                .post("/api/projects/1/teams")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("PUT /api/projects/1/teams/2", () => {
            return chai
                .request(app)
                .put("/api/projects/1/teams/2")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("DELETE /api/projects/1/teams/2", () => {
            return chai
                .request(app)
                .delete("/api/projects/1/teams/2")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("POST /api/users", () => {
            return chai
                .request(app)
                .post("/api/users")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("GET /api/users", () => {
            return chai
                .request(app)
                .get("/api/users")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("GET /api/users/3", () => {
            return chai
                .request(app)
                .get("/api/users/3")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("GET /api/users/username/username", () => {
            return chai
                .request(app)
                .get("/api/users/username/username")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("DELETE /api/users/3", () => {
            return chai
                .request(app)
                .delete("/api/users/3")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("PUT /api/users/3/projects/", () => {
            return chai
                .request(app)
                .put("/api/users/3/projects/")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("DELETE /api/users/3/projects/1", () => {
            return chai
                .request(app)
                .delete("/api/users/3/projects/1")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("GET /api/projects/1/retrospectives", () => {
            return chai
                .request(app)
                .get("/api/projects/1/retrospectives")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("POST /api/projects/1/retrospectives", () => {
            return chai
                .request(app)
                .post("/api/projects/1/retrospectives")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("PUT /api/projects/1/retrospectives/4", () => {
            return chai
                .request(app)
                .put("/api/projects/1/retrospectives/4")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("DELETE /api/projects/1/retrospectives/4", () => {
            return chai
                .request(app)
                .delete("/api/projects/1/retrospectives/4")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("POST /api/questions", () => {
            return chai
                .request(app)
                .post("/api/questions")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("GET /api/questions", () => {
            return chai
                .request(app)
                .get("/api/questions")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("GET /api/questions/5", () => {
            return chai
                .request(app)
                .get("/api/questions/5")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("PUT /api/questions/5", () => {
            return chai
                .request(app)
                .put("/api/questions/5")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("DELETE /api/questions/5", () => {
            return chai
                .request(app)
                .delete("/api/questions/5")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("GET /api/retrospectives/4/questions/", () => {
            return chai
                .request(app)
                .get("/api/retrospectives/4/questions/")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("PUT /api/retrospectives/4/questions/", () => {
            return chai
                .request(app)
                .put("/api/retrospectives/4/questions/")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("DELETE /api/retrospectives/4/questions/5", () => {
            return chai
                .request(app)
                .delete("/api/retrospectives/4/questions/5")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("GET /api/retrospectives/4/questions/5/answers/", () => {
            return chai
                .request(app)
                .get("/api/retrospectives/4/questions/5/answers/")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("POST /api/retrospectives/4/questions/5/answers/", () => {
            return chai
                .request(app)
                .post("/api/retrospectives/4/questions/5/answers/")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("PUT /api/answers/6", () => {
            return chai
                .request(app)
                .put("/api/answers/6")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
        it("DELETE /api/answers/6", () => {
            return chai
                .request(app)
                .delete("/api/answers/6")
                .then(res => expect.fail())
                .catch(err => {
                    expect(err.status).to.eql(401);
                    expect(err.message).to.eql("Unauthorized");
                });
        });
    });
});
