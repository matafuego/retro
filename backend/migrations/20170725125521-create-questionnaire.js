"use strict";
module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable("Questionnaire", {
            retroId: {
                type: Sequelize.INTEGER,
                onDelete: "CASCADE",
                references: {
                    model: "Retrospectives",
                    key: "id",
                    as: "retroId"
                }
            },
            questionId: {
                type: Sequelize.INTEGER,
                onDelete: "CASCADE",
                references: {
                    model: "Questions",
                    key: "id",
                    as: "questionId"
                }
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        }),

    down: (queryInterface, Sequelize) =>
        queryInterface.dropTable("Questionnaire")
};
