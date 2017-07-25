const chaiHttp = require("chai-http");
const chai = require("chai");

const app = require("../app");
const db = require("../models");
const mysqlhelper = require("./mysqlhelper");

const Project = db.Project;
const User = db.User;

chai.use(chaiHttp);
const expect = chai.expect;

require("./globalBefore");

describe("User", () => {
    beforeEach(() => {
        return db.sequelize
            .query("TRUNCATE table Staffing")
            .then(result => {
                return mysqlhelper.truncate(User, db.sequelize);
            })
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
                const userOne = {
                    username: "oneUser",
                    email: "one@mail.com",
                    name: "One User Name",
                    id: 1
                };
                return User.create(userOne);
            });
    });

    describe("GET request on /api/users", () => {
        it("should be json", () => {
            return chai.request(app).get("/api/users").then(res => {
                expect(res.type).to.eql("application/json");
            });
        });
        it("should return a 200 status", () => {
            return chai.request(app).get("/api/users").then(res => {
                expect(res.status).to.eql(200);
            });
        });
    });

    describe("GET request on /api/users/:userId", () => {
        it("should be a user object", () => {
            return chai.request(app).get("/api/users/1").then(res => {
                const user = res.body;
                expect(user).to.be.an("object");
                expect(user.username).to.eql("oneUser");
                expect(user.name).to.eql("One User Name");
                expect(user.email).to.eql("one@mail.com");
            });
        });
        it("should return a 404 code", () => {
            return chai.request(app).get("/api/users/2").catch(err => {
                expect(err.status).to.eql(404);
                expect(err.message).to.eql("Not Found");
            });
        });
    });

    describe("GET request on /api/users/username/:username", () => {
        it("should be a user object", () => {
            return chai
                .request(app)
                .get("/api/users/username/oneUser")
                .then(res => {
                    const user = res.body;
                    expect(user).to.be.an("object");
                    expect(user.username).to.eql("oneUser");
                    expect(user.name).to.eql("One User Name");
                    expect(user.email).to.eql("one@mail.com");
                });
        });
        it("should return a 404 code", () => {
            return chai
                .request(app)
                .get("/api/users/username/twoUser")
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
    });

    describe("POST request on /api/users", () => {
        it("should create a new user", () => {
            const obj = {
                username: "twoUser",
                email: "two@mail.com",
                name: "Two User Name"
            };
            return chai.request(app).post("/api/users").send(obj).then(res => {
                const user = res.body;
                expect(user).to.be.an("object");
                expect(user.username).to.eql("twoUser");
                expect(user.name).to.eql("Two User Name");
                expect(user.email).to.eql("two@mail.com");
                return User.findById(user.id).then(retrieved => {
                    expect(retrieved.username).to.be.eql(user.username);
                });
            });
        });
        it("should fail if user is not unique", () => {
            const obj = {
                username: "oneUser"
            };
            return chai.request(app).post("/api/users").send(obj).catch(err => {
                expect(err.status).to.eql(409);
                expect(err.message).to.eql("Conflict");
            });
        });
        it("should fail if email is not unique", () => {
            const obj = {
                username: "fiveUser",
                email: "one@mail.com"
            };
            return chai.request(app).post("/api/users").send(obj).catch(err => {
                expect(err.status).to.eql(409);
                expect(err.message).to.eql("Conflict");
            });
        });
    });

    describe("DELETE request on /api/users/:id", () => {
        it("should send a 204 status", () => {
            return chai.request(app).delete("/api/users/1").then(res => {
                expect(res.status).to.be.eql(204);
                return User.findById(1).then(user => {
                    expect(user).to.be.null;
                });
            });
        });
        it("should return a 404 code", () => {
            return chai.request(app).delete("/api/users/2").catch(err => {
                expect(err.status).to.eql(404);
                expect(err.message).to.eql("Not Found");
            });
        });
    });

    describe("PUT request on /api/users/:userId/projects/", () => {
        it("should add a project to a user", () => {
            const obj = [
                {
                    projectId: 1
                }
            ];
            return chai
                .request(app)
                .put("/api/users/1/projects")
                .send(obj)
                .then(res => {
                    const user = res.body;
                    expect(user).to.be.an("object");
                    expect(user.username).to.eql("oneUser");
                    return User.findById(user.id).then(retrieved => {
                        expect(retrieved.username).to.be.eql(user.username);
                        return retrieved.getProjects().then(projects => {
                            expect(projects.length).to.be.eql(1);
                        });
                    });
                });
        });
        it("should add more than one project to a user", () => {
            const obj = [
                {
                    projectId: 1
                },
                {
                    projectId: 2
                }
            ];
            return chai
                .request(app)
                .put("/api/users/1/projects")
                .send(obj)
                .then(res => {
                    const user = res.body;
                    expect(user).to.be.an("object");
                    expect(user.username).to.eql("oneUser");
                    return User.findById(user.id).then(retrieved => {
                        expect(retrieved.username).to.be.eql(user.username);
                        return retrieved.getProjects().then(projects => {
                            expect(projects.length).to.be.eql(2);
                        });
                    });
                });
        });
        it("should not add any projects if they don't exist", () => {
            const obj = [
                {
                    projectId: 1
                },
                {
                    projectId: 9
                }
            ];
            return chai
                .request(app)
                .put("/api/users/1/projects")
                .send(obj)
                .catch(err => {
                    expect(err.status).to.eql(400);
                    expect(err.message).to.eql("Bad Request");
                })
                .then(res => {
                    return User.findById(1).then(retrieved => {
                        return retrieved.getProjects().then(projects => {
                            expect(projects.length).to.be.eql(0);
                        });
                    });
                });
        });
        it("should fail if user does not exist", () => {
            const obj = [
                {
                    projectId: 1
                }
            ];
            return chai
                .request(app)
                .put("/api/users/2/projects")
                .send(obj)
                .catch(err => {
                    expect(err.status).to.eql(404);
                    expect(err.message).to.eql("Not Found");
                });
        });
    });
});
