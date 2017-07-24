const chaiHttp = require('chai-http')
const chai = require('chai')

const app = require('../app')
const db = require('../models')
const mysqlhelper = require('./mysqlhelper')

const Project = db.Project
const User = db.User

chai.use(chaiHttp)
const expect = chai.expect

require('./globalBefore')

describe('User', () => {

    beforeEach(() => {
        return db.sequelize.query('TRUNCATE table staffing').
            then(result => {
                return mysqlhelper.truncate(User, db.sequelize)
            }).then(result => {
                return mysqlhelper.truncate(Project, db.sequelize)
            }).then(result => {
                const projectOne = {
                    name: 'myFirstProject',
                    id: 1
                }
                return Project.create(projectOne)
            }).then(result => {
                const projectTwo = {
                    name: 'mySecondProject',
                    id: 2
                }
                return Project.create(projectTwo)
            }).then(result => {
                const userOne = {
                    username: 'oneUser',
                    id: 1
                }
                return User.create(userOne)
            })
    })

    describe('GET request on /api/users', () => {
        it('should be json', () => {
            return chai.request(app).get('/api/users')
                .then(res => {
                    expect(res.type).to.eql('application/json')
                })
        })
        it('should return a 200 status', () => {
            return chai.request(app).get('/api/users')
                .then(res => {
                    expect(res.status).to.eql(200)
                })
        })
    })


    describe('GET request on /api/users/:userId', () => {
        it('should be a user object', () => {
            return chai.request(app).get('/api/users/1')
                .then(res => {
                    const user = res.body
                    expect(user).to.be.an('object')
                    expect(user.username).to.eql('oneUser')
                })
        })
        it('should return a 404 code', () => {
            return chai.request(app).get('/api/users/2')
                .catch(err => {
                    expect(err.status).to.eql(404)
                    expect(err.message).to.eql('Not Found')
                })
        })
    })

    describe('GET request on /api/users/username/:username', () => {
        it('should be a user object', () => {
            return chai.request(app).get('/api/users/username/oneUser')
                .then(res => {
                    const user = res.body
                    expect(user).to.be.an('object')
                    expect(user.username).to.eql('oneUser')
                })
        })
        it('should return a 404 code', () => {
            return chai.request(app).get('/api/users/username/twoUser')
                .catch(err => {
                    expect(err.status).to.eql(404)
                    expect(err.message).to.eql('Not Found')
                })
        })
    })

    describe('POST request on /api/users', () => {
        it('should create a new user', () => {
            const obj = {
                username: 'twoUser'
            }
            return chai.request(app)
                .post('/api/users').send(obj)
                .then(res => {
                    const user = res.body
                    expect(user).to.be.an('object')
                    expect(user.username).to.eql('twoUser')
                    return User.findById(user.id).then(retrieved => {
                        expect(retrieved.username).to.be.eql(user.username)
                    })
                })
        })
        it('should fail if user is not unique', () => {
            const obj = {
                username: 'oneUser'
            }
            return chai.request(app)
                .post('/api/users').send(obj)
                .catch(err => {
                    expect(err.status).to.eql(409)
                    expect(err.message).to.eql('Conflict')
                })
        })

    })

    describe('DELETE request on /api/users/:id', () => {
        it('should send a 204 status', () => {
            return chai.request(app)
                .delete('/api/users/1')
                .then(res => {
                    expect(res.status).to.be.eql(204)
                    return User.findById(1).then(user => {
                        expect(user).to.be.null
                    })
                })
        })
        it('should return a 404 code', () => {
            return chai.request(app).delete('/api/users/2')
                .catch(err => {
                    expect(err.status).to.eql(404)
                    expect(err.message).to.eql('Not Found')
                })
        })
    })

})