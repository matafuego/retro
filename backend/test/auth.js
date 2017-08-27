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
});
