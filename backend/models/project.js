'use strict';

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Project.associate = (models) => {
    Project.hasMany(models.Team, {
      foreignKey: 'projectId',
      as: 'teams',
    });
  };

  return Project;
};