"use strict";
module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable("Staffing", {
            projectId: {
                type: Sequelize.INTEGER,
                onDelete: "CASCADE",
                references: {
                    model: "Projects",
                    key: "id",
                    as: "projectId"
                }
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
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        }),

    down: (queryInterface, Sequelize) => queryInterface.dropTable("Staffing")
};
