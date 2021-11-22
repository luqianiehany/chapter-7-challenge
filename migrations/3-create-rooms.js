module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("rooms", {
      room_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      room_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      player_one_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      player_two_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id"
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      rounds: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      player_one_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      player_two_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      player_one_choice1: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      player_one_choice2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      player_one_choice3: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      player_two_choice1: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      player_two_choice2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      player_two_choice3: {
        type: Sequelize.STRING,
        allowNull: true,
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
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("rooms");
  },
};
