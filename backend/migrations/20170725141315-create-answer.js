"use strict";
module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable("Answers", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            answer: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            userId: {
                type: Sequelize.INTEGER,
                onDelete: "CASCADE",
                references: {
                    model: "Users",
                    key: "id",
                    as: "userId"
                }
            },
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
            }
        }),
    down: queryInterface => queryInterface.dropTable("Answers")
};
