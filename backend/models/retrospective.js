"use strict";
module.exports = (sequelize, DataTypes) => {
    const Retrospective = sequelize.define("Retrospective", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });
    Retrospective.associate = models => {
        Retrospective.belongsTo(models.Project, {
            foreignKey: "projectId",
            onDelete: "CASCADE"
        });
        Retrospective.belongsToMany(models.Question, {
            as: "questions",
            through: "Questionnaire",
            foreignKey: "retroId",
            onDelete: "CASCADE"
        });
    };

    return Retrospective;
};
