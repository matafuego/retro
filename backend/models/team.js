'use strict';

module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    classMethods: {
      associate: (models) => {
        Team.belongsTo(models.Project, {
          foreignKey: 'projectId',
          onDelete: 'CASCADE',
        });
      }
    }
  });
  return Team;
};