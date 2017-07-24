process.env.NODE_ENV = 'test'

const chaiHttp = require('chai-http')
const chai = require('chai')

const app = require('../app')
const db = require('../models')
const mysqlhelper = require('./mysqlhelper')

const Project = db.Project

chai.use(chaiHttp)
const expect = chai.expect

require('./globalBefore')

describe('Project', () => {

    beforeEach(() => {
        return mysqlhelper.truncate(Project, db.sequelize).then(result => {

            const testObject = {
                name: 'myFirstProject',
                id: 1
            }
            return Project.create(testObject)
        });
    })

    describe('GET request on /projects', () => {
        it('should be json', () => {
            return chai.request(app).get('/api/projects')
                .then(res => {
                    expect(res.type).to.eql('application/json')
                })
        })
        it('should return a 200 status', () => {
            return chai.request(app).get('/api/projects')
                .then(res => {
                    expect(res.status).to.eql(200)
                })
        })
    })

    describe('GET request on /projects/:id', () => {
        it('should be a project object', () => {
            return chai.request(app).get('/api/projects/1')
                .then(res => {
                    const project = res.body
                    expect(project).to.be.an('object')
                    expect(project.name).to.eql('myFirstProject')
                })
        })
        it('should return a 404 code', () => {
            return chai.request(app).get('/api/projects/2')
                .catch(err => {
                    expect(err.status).to.eql(404)
                    expect(err.message).to.eql('Not Found')
                })
        })
    })

    describe('POST request on /projects', () => {
        it('should create a new project', () => {
            const obj = {
                name: 'mySecondProject'
            }
            return chai.request(app)
                .post('/api/projects').send(obj)
                .then(res => {
                    const project = res.body
                    expect(project).to.be.an('object')
                    expect(project.name).to.eql('mySecondProject')
                    return Project.findById(project.id).then(retrievedProject => {
                        expect(retrievedProject.name).to.be.eql('mySecondProject')
                    })
                })
        })
    })

    describe('PUT request on /projects/:id', () => {
        const obj = {
            name: 'myFirstProjectUpdated'
        }
        it('should send a 200 status', () => {
            return chai.request(app).put('/api/projects/1').send(obj)
                .then(res => {
                    expect(res.status).to.be.eql(200)
                    return Project.findById(1).then(project => {
                        expect(project.name).to.be.eql('myFirstProjectUpdated')
                    })
                })
        })
        it('should return a 404 code', () => {
            return chai.request(app).put('/api/projects/2')
                .send(obj)
                .catch(err => {
                    expect(err.status).to.eql(404)
                    expect(err.message).to.eql('Not Found')
                })
        })
    })

    describe('DELETE request on /projects/:id', () => {
        it('should send a 200 status', () => {
            return chai.request(app)
                .delete('/api/projects/1')
                .then(res => {
                    expect(res.status).to.be.eql(204)
                    return Project.findById(1).then(project => {
                        expect(project).to.be.null
                    })
                })
        })
        it('should return a 404 code', () => {
            return chai.request(app).delete('/api/projects/2')
                .catch(err => {
                    expect(err.status).to.eql(404)
                    expect(err.message).to.eql('Not Found')
                })
        })
    })
})