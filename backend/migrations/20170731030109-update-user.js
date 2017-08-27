"use strict";

module.exports = {
    up: function(queryInterface, Sequelize) {
        return Sequelize.Promise.all([
            queryInterface.addColumn("Users", "password", {
                type: Sequelize.STRING,
                allowNull: false
            })
        ]);
    },

    down: function(queryInterface, Sequelize) {
        return Sequelize.Promise.all([
            queryInterface.removeColumn("Users", "password")
        ]);
    }
};
