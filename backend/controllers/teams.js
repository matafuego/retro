const Team = require("../models").Team;
const Project = require("../models").Project;
const Errors = require("../errors/errors");

module.exports = {
    create(req, res, next) {
        return Project.findById(req.params.projectId)
            .then(project => {
                if (!project) {
                    throw Errors.notFound(
                        "projectNotFound",
                        "Project not found"
                    );
                }
                return Team.create({
                    name: req.body.name,
                    projectId: req.params.projectId
                });
            })
            .then(team => res.status(201).send(team))
            .catch(error => next(error));
    },

    update(req, res, next) {
        return Team.find({
            where: {
                id: req.params.teamId,
                projectId: req.params.projectId
            }
        })
            .then(team => {
                if (!team) {
                    throw Errors.notFound("teamNotFound", "Team not found");
                }

                return team
                    .update(req.body, { fields: Object.keys(req.body) })
                    .then(updatedTeam => res.status(200).send(updatedTeam))
                    .catch(error => next(error));
            })
            .catch(error => next(error));
    },

    delete(req, res, next) {
        return Team.find({
            where: {
                id: req.params.teamId,
                projectId: req.params.projectId
            }
        })
            .then(team => {
                if (!team) {
                    throw Errors.notFound("teamNotFound", "Team not found");
                }

                return team
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch(error => next(error));
            })
            .catch(error => next(error));
    }
};
