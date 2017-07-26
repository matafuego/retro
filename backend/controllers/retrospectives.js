const Retrospective = require("../models").Retrospective;
const Project = require("../models").Project;
const Question = require("../models").Question;
const Errors = require("../errors/errors");
const sequelize = require("../models").sequelize;

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
    },
    addQuestions(req, res, next) {
        return sequelize
            .transaction()
            .then(function(t) {
                return Retrospective.findById(req.params.retroId, {
                    transaction: t
                })
                    .then(retro => {
                        if (!retro) {
                            throw Errors.notFound(
                                "retroNotFound",
                                "Retrospective not found"
                            );
                        }

                        var promises = [];
                        var questions = req.body;
                        questions.forEach(question =>
                            promises.push(
                                addQuestionToRetro(
                                    retro,
                                    question.questionId,
                                    t
                                )
                            )
                        );

                        return sequelize.Promise.all(promises);
                    })
                    .then(result => {
                        return Retrospective.findById(req.params.retroId, {
                            include: [
                                {
                                    model: Question,
                                    as: "questions"
                                }
                            ],
                            transaction: t
                        });
                    })
                    .then(retro => {
                        if (!retro) {
                            throw Errors.notFound(
                                "retroNotFound",
                                "Retrospective not found"
                            );
                        }
                        return res.status(200).send(retro);
                    })
                    .then(result => {
                        return t.commit();
                    })
                    .catch(error => {
                        t.rollback();
                        next(error);
                    });
            })
            .catch(error => next(error));
    }
};

function addQuestionToRetro(retro, questionId, t) {
    return Question.findById(questionId, { transaction: t }).then(question => {
        if (!question) {
            throw Errors.badRequest(
                "questionNotFound",
                "Question " + questionId + " does not exist"
            );
        }
        return retro.addQuestion(question, { transaction: t });
    });
}
