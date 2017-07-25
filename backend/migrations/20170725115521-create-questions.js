"use strict";
module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable("Questions", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            question: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false
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

    down: (queryInterface, Sequelize) => queryInterface.dropTable("Questions")
};
