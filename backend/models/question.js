"use strict";
module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define("Question", {
        question: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Question.associate = models => {
        Question.belongsToMany(models.Retrospective, {
            as: "retrospectives",
            through: "Questionnaire",
            foreignKey: "questionId",
            onDelete: "CASCADE"
        });
    };

    return Question;
};
