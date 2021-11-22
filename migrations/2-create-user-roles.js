module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userRoles', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.ENUM('SuperAdmin', 'PlayerUser'),
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
    }); 
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.dropTable('userRoles');
  }
};
