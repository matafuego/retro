process.env.NODE_ENV = 'test'

const chaiHttp = require('chai-http')
const chai = require('chai')

const app = require('../app')
const db = require('../models')

const Project = db.Project

chai.use(chaiHttp)
const expect = chai.expect

describe('Project', () => {
    before(() => {
        return Project.sync({ force: true })
    })

    beforeEach(() => {
        const testObject = {
            name: 'myFirstProject',
            id: 1
        }
        return Project.create(testObject)
    })

    afterEach(() => {
        return Project.truncate()
    })

    after(() => {
        return Project.drop()
    })

    describe('GET request on /projects', () => {
        it('should be json', () => {
            return chai.request(app).get('/projects')
                .then(res => {
                    expect(res.type).to.eql('application/json')
                })
        })
        it('should return a 200 status', () => {
            return chai.request(app).get('/projects')
                .then(res => {
                    expect(res.status).to.eql(200)
                })
        })
    })

    describe('GET request on /projects/:id', () => {
        it('should be a project object', () => {
            return chai.request(app).get('/projects/1')
                .then(res => {
                    const project = JSON.parse(res.text).project
                    expect(project).to.be.an('object')
                    expect(project.name).to.eql('myFirstProject')
                })
        })
        it('should return a 404 code', () => {
            return chai.request(app).get('/projects/2')
                .catch(err => {
                    expect(err.status).to.eql(404)
                    expect(err.message).to.eql('Project not found')
                })
        })
    })

    describe('POST request on /projects', () => {
        it('should create a new project', () => {
            const obj = {
                name: 'mySecondProject',
                id: 5
            }
            return chai.request(app)
                .post('/projects').send(obj)
                .then(res => {
                    const project = JSON.parse(res.text).project
                    expect(project).to.be.an('object')
                    expect(project.name).to.eql('mySecondProject')
                })
        })
    })

    describe('PUT request on /projects/:id', () => {
        const obj = {
            firstName: 'myFirstProjectUpdated'
        }
        it('should send a 200 status', () => {
            return chai.request(app).put('/projects/1').send(obj)
                .then(res => {
                    expect(res.status).to.be.eql(200)
                    Project.findById(1).then(project => {
                        expect(project.dataValues.name).to.be.eql('myFirstProjectUpdated')
                    })
                })
        })
        it('should return a 404 code', () => {
            return chai.request(app).put('/projects/2')
                .send(obj)
                .catch(err => {
                    expect(err.status).to.eql(404)
                    expect(err.message).to.eql('Project not found')
                })
        })
    })

    describe('DELETE request on /projects/:id', () => {
        it('should send a 200 status', () => {
            return chai.request(app)
                .delete('/projects/1')
                .then(res => {
                    expect(res.status).to.be.eql(200)
                    Project.findById(1).then(project => {
                        expect(project).to.be.null
                    })
                })
        })
        it('should return a 404 code', () => {
            return chai.request(app).delete('/projects/2')
                .catch(err => {
                    expect(err.status).to.eql(404)
                    expect(err.message).to.eql('Project not found')
                })
        })
    })
})