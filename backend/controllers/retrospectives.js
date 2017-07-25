const Retrospective = require("../models").Retrospective;
const Project = require("../models").Project;
const Errors = require("../errors/errors");

module.exports = {
    list(req, res, next) {
        return Project.findById(req.params.projectId)
            .then(project => {
                if (!project) {
                    throw Errors.notFound(
                        "projectNotFound",
                        "Project not found"
                    );
                }
                return Retrospective.findAll({
                    where: {
                        projectId: {
                            $eq: req.params.projectId
                        }
                    }
                });
            })
            .then(retros => res.status(200).send(retros))
            .catch(error => next(error));
    },

    create(req, res, next) {
        return Project.findById(req.params.projectId)
            .then(project => {
                if (!project) {
                    throw Errors.notFound(
                        "projectNotFound",
                        "Project not found"
                    );
                }
                return Retrospective.create({
                    name: req.body.name,
                    date: req.body.date,
                    projectId: req.params.projectId
                });
            })
            .then(Retrospective => res.status(201).send(Retrospective))
            .catch(error => next(error));
    },

    update(req, res, next) {
        return Retrospective.find({
            where: {
                id: req.params.retroId,
                projectId: req.params.projectId
            }
        })
            .then(Retrospective => {
                if (!Retrospective) {
                    throw Errors.notFound(
                        "RetrospectiveNotFound",
                        "Retrospective not found"
                    );
                }

                return Retrospective.update(req.body, {
                    fields: Object.keys(req.body)
                }).then(updatedRetrospective =>
                    res.status(200).send(updatedRetrospective)
                );
            })
            .catch(error => next(error));
    },

    delete(req, res, next) {
        return Retrospective.find({
            where: {
                id: req.params.retroId,
                projectId: req.params.projectId
            }
        })
            .then(Retrospective => {
                if (!Retrospective) {
                    throw Errors.notFound(
                        "RetrospectiveNotFound",
                        "Retrospective not found"
                    );
                }

                return Retrospective.destroy().then(() =>
                    res.status(204).send()
                );
            })
            .catch(error => next(error));
    }
};
