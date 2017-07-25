"use strict";
module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable("Retrospectives", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            date: {
                allowNull: false,
                type: Sequelize.DATE
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            projectId: {
                type: Sequelize.INTEGER,
                onDelete: "CASCADE",
                references: {
                    model: "Projects",
                    key: "id",
                    as: "projectId"
                }
            }
        }),
    down: queryInterface => queryInterface.dropTable("Retrospectives")
};
