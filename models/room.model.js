const { Model, DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

class Room extends Model {}

Room.init(
  {
	room_id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	},
    room_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
	player_one_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	player_two_id: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	rounds: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	player_one_score: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	player_two_score: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
    player_one_choice1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    player_one_choice2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    player_one_choice3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    player_two_choice1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    player_two_choice2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    player_two_choice3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
	createdAt: {
		type: DataTypes.DATE,
		defaultValue: new Date()
	},
	updatedAt: {
		type: DataTypes.DATE,
		defaultValue: new Date()
	},
	deletedAt: {
		type: DataTypes.DATE,
		allowNull: true
	}
  },
  {
    sequelize,
    tableName: "rooms",
    modelName: "rooms",
	timestamps: true,
	paranoid: true
  }
);

module.exports = Room;
