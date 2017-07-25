"use strict";

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    User.associate = models => {
        User.belongsToMany(models.Project, {
            as: "projects",
            through: "Staffing",
            foreignKey: "userId",
            onDelete: "CASCADE"
        });
    };

    return User;
};
