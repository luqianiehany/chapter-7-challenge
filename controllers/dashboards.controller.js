const { User, UserRole } = require('../models')
const Room = require("../models/room.model");
const { Op } = require("sequelize");

exports.viewDashboard = async (req, res, next) => {
    try {
        const { user } = req
        const users = await User.findAll({
            attributes: ['id', 'fullName', 'email'],
            include: [
                {
                    model: UserRole,
                    as: 'role',
                    attributes: ['name']
                }
            ]
        })
		
		const rooms = await Room.findAll({
            attributes: ['room_id', 'room_name', 'player_one_id', 'player_two_id', 'player_one_score', 'player_two_score'],
            include: [
                {
                    model: User,
                    as: 'player1',
                    attributes: ['fullName']
                },
				{
                    model: User,
                    as: 'player2',
                    attributes: ['fullName']
                }
            ]
        })
		
		
		const ownrooms = await Room.findAll({
            attributes: ['room_id', 'room_name', 'player_one_id', 'player_two_id', 'player_one_score', 'player_two_score'],
            include: [
                {
                    model: User,
                    as: 'player1',
                    attributes: ['fullName']
                },
				{
                    model: User,
                    as: 'player2',
                    attributes: ['fullName']
                }
            ],
			where: {
				[Op.or]: [{ player_one_id: user.id }, { player_two_id: user.id }]
            }
        })
		
		const currentuserrole = await UserRole.findOne({
            where: {
                userId: user.id
            }
        });

        return res.status(200).render('dashboard', {
            users,
			rooms,
			ownrooms,
            fullName: user.fullName,
            currentuserrole
        })
    } catch (error) {
        next(error)
    }
}