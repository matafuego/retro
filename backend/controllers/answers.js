const Retrospective = require("../models").Retrospective;
const Question = require("../models").Question;
const Answer = require("../models").Answer;
const User = require("../models").User;

const Errors = require("../errors/errors");

module.exports = {
    list(req, res, next) {
        return Retrospective.findById(req.params.retroId, {
            include: [
                {
                    model: Question,
                    as: "questions"
                }
            ]
        })
            .then(retro => {
                if (!retro) {
                    throw Errors.notFound(
                        "retrospectiveNotFound",
                        "Retrospective not found"
                    );
                }

                return findQuestionInRetro(retro, req.params.questionId);
            })
            .then(question => {
                return Answer.findAll({
                    where: {
                        retroId: req.params.retroId,
                        questionId: req.params.questionId
                    }
                });
            })
            .then(answers => res.status(200).send(answers))
            .catch(error => next(error));
    },

    update(req, res, next) {
        return Answer.findById(req.params.answerId)
            .then(answer => {
                if (!answer) {
                    throw Errors.notFound("AnswerNotFound", "Answer not found");
                }

                return answer
                    .update({
                        answer: req.body.answer || answer.answer
                    })
                    .then(updatedRetrospective =>
                        res.status(200).send(updatedRetrospective)
                    );
            })
            .catch(error => next(error));
    },

    delete(req, res, next) {
        return Answer.findById(req.params.answerId)
            .then(answer => {
                if (!answer) {
                    throw Errors.notFound("AnswerNotFound", "Answer not found");
                }

                return answer.destroy().then(() => res.status(204).send());
            })
            .catch(error => next(error));
    },

    answerQuestion(req, res, next) {
        return Answer.findOne({
            where: {
                retroId: req.params.retroId,
                questionId: req.params.questionId,
                userId: req.body.userId
            }
        })
            .then(answer => {
                if (answer) {
                    throw Errors.conflict(
                        "AnswerExists",
                        "Answer already exists"
                    );
                }

                return Retrospective.findById(req.params.retroId, {
                    include: [
                        {
                            model: Question,
                            as: "questions"
                        }
                    ]
                });
            })
            .then(retro => {
                if (!retro) {
                    throw Errors.notFound(
                        "retroNotFound",
                        "Retrospective not found"
                    );
                }

                return findQuestionInRetro(retro, req.params.questionId);
            })
            .then(question => {
                return User.findById(req.body.userId);
            })
            .then(user => {
                if (!user) {
                    throw Errors.badRequest(
                        "userNotFound",
                        "User does not exist"
                    );
                }
                return Answer.create({
                    answer: req.body.answer,
                    userId: req.body.userId,
                    questionId: req.params.questionId,
                    retroId: req.params.retroId
                });
            })
            .then(answer => res.status(201).send(answer))
            .catch(error => next(error));
    }
};

function findQuestionInRetro(retro, questionId) {
    var found;
    retro.questions.forEach(question => {
        if (question.id == questionId) {
            found = question;
        }
    });
    if (!found) {
        throw Errors.notFound("questionNotFound", "Question not found");
    }
    return found;
}
