"use strict";

module.exports = (sequelize, DataTypes) => {
    const Answer = sequelize.define(
        "Answer",
        {
            answer: {
                type: DataTypes.TEXT,
                allowNull: false
            }
        },
        {
            indexes: [
                {
                    unique: true,
                    fields: ["userId", "retroId", "questionId"]
                }
            ]
        }
    );

    Answer.associate = models => {
        Answer.belongsTo(models.User, {
            foreignKey: "userId",
            onDelete: "CASCADE"
        });
        Answer.belongsTo(models.Retrospective, {
            foreignKey: "retroId",
            onDelete: "CASCADE"
        });
        Answer.belongsTo(models.Question, {
            foreignKey: "questionId",
            onDelete: "CASCADE"
        });
    };

    return Answer;
};
