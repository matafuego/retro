const Question = require("../models").Question;
const Errors = require("../errors/errors");

module.exports = {
    create(req, res, next) {
        return Question.create({
            question: req.body.question,
            type: req.body.type
        })
            .then(question => res.status(201).send(question))
            .catch(error => next(error));
    },

    list(req, res, next) {
        return Question.findAll()
            .then(questions => res.status(200).send(questions))
            .catch(error => next(error));
    },

    retrieve(req, res, next) {
        return Question.findById(req.params.questionId)
            .then(question => {
                if (!question) {
                    throw Errors.notFound(
                        "questionNotFound",
                        "question not found"
                    );
                }
                return res.status(200).send(question);
            })
            .catch(error => next(error));
    },

    update(req, res, next) {
        return Question.findById(req.params.questionId)
            .then(question => {
                if (!question) {
                    throw Errors.notFound(
                        "questionNotFound",
                        "question not found"
                    );
                }
                return question
                    .update(req.body, { fields: Object.keys(req.body) })
                    .then(() => res.status(200).send(question)) // Send back the updated question.
                    .catch(error => next(error));
            })
            .catch(error => next(error));
    },

    delete(req, res, next) {
        return Question.findById(req.params.questionId)
            .then(question => {
                if (!question) {
                    throw Errors.notFound(
                        "questionNotFound",
                        "question not found"
                    );
                }
                return question
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch(error => next(error));
            })
            .catch(error => next(error));
    }
};
