const User = require('./users.model')
const UserRole = require('./user-roles.model')
const Room = require('./room.model')
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')

User.hasOne(UserRole, {
    as: 'role',
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

UserRole.belongsTo(User, {
    as: 'user',
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

Room.belongsTo(User, {
    as: 'player1',
    foreignKey: 'player_one_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

Room.belongsTo(User, {
    as: 'player2',
    foreignKey: 'player_two_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

module.exports = {
    User,
    UserRole,
	Room,
    sequelize,
    Sequelize
}