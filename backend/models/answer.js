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
            onDelete: "CASCADE",
            allowNull: false
        });
        Answer.belongsTo(models.Retrospective, {
            foreignKey: "retroId",
            onDelete: "CASCADE",
            allowNull: false
        });
        Answer.belongsTo(models.Question, {
            foreignKey: "questionId",
            onDelete: "CASCADE",
            allowNull: false
        });
    };

    return Answer;
};
