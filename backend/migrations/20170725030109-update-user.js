"use strict";

module.exports = {
    up: function(queryInterface, Sequelize) {
        return Sequelize.Promise.all([
            queryInterface.addColumn("Users", "email", {
                type: Sequelize.STRING,
                allowNull: false
            }),
            queryInterface.addColumn("Users", "name", Sequelize.STRING)
        ]);
    },

    down: function(queryInterface, Sequelize) {
        return Sequelize.Promise.all([
            queryInterface.removeColumn("Users", "name"),
            queryInterface.removeColumn("Users", "email")
        ]);
    }
};
