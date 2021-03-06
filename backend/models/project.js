"use strict";

module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define("Project", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Project.associate = models => {
        Project.hasMany(models.Team, {
            foreignKey: "projectId",
            as: "teams"
        });
        Project.belongsToMany(models.User, {
            as: "members",
            through: "Staffing",
            foreignKey: "projectId",
            onDelete: "CASCADE"
        });
        Project.hasMany(models.Retrospective, {
            foreignKey: "projectId",
            as: "retrospectives"
        });
    };

    return Project;
};
