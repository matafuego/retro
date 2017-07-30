"use strict";
module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable(
            "Answers",
            {
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
                    allowNull: false,
                    onDelete: "CASCADE",
                    references: {
                        model: "Users",
                        key: "id",
                        as: "userId"
                    }
                },
                retroId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    onDelete: "CASCADE",
                    references: {
                        model: "Retrospectives",
                        key: "id",
                        as: "retroId"
                    }
                },
                questionId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    onDelete: "CASCADE",
                    references: {
                        model: "Questions",
                        key: "id",
                        as: "questionId"
                    }
                }
            },
            {
                uniqueKeys: {
                    answer_unique: {
                        fields: ["questionId", "retroId", "userId"]
                    }
                }
            }
        ),
    down: queryInterface => queryInterface.dropTable("Answers")
};
