const { User, UserRole } = require('../models');
const Room = require("../models/room.model");

exports.createRoom = async (req, res, next) => {
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
		
		const currentuserroles = await UserRole.findAll({
			where: { userId: user.id }
        })

        return res.status(200).render('create-room', {
            users,
            fullName: user.fullName,
            currentuserroles
        })
    } catch (error) {
        next(error)
    }
}

exports.createRoomSubmit = async (req, res, next) => {
    try {
		const { user } = req;
        const { roomName } = req.body;
		
		if (!roomName) {
		  throw {
			message: `room name must be valid`,
			code: 400,
			error: `bad request`,
		  };
		}

        const isRoomExist = await Room.findOne({
            where: {
                room_name: roomName
            }
        });

        if(isRoomExist){
			if(isRoomExist.player_one_id == user.id)
			{
				// Room exist, you are already in the room and you are player one
				return res.status(301).redirect('/fight?room_id='+isRoomExist.room_id);
			}
			else
			{
				if(!isRoomExist.player_two_id)
				{
					// Room exist but player two empty, set you as player two
					await Room.update(
						{
							player_two_id: user.id,
							rounds: 1
						},
						{
							where: { room_id: isRoomExist.room_id }
						}
					);
					
					return res.status(301).redirect('/fight?room_id='+isRoomExist.room_id);
				}
				else
				{
					if(isRoomExist.player_two_id == user.id)
					{
						// Room exist, you are already in the room and you are player two
						return res.status(301).redirect('/fight?room_id='+isRoomExist.room_id);
					}
					else
					{
						// Room is full
						throw {
							message: `Room is full`,
							code: 400,
							error: `bad request`,
						};
					}
				}
			}
        }
		else
		{
			const createdroom = await Room.create({
				room_name: roomName,
				player_one_id: user.id,
				rounds: 0,
				player_one_score: 0,
				player_two_score: 0
			})
			
			return res.status(301).redirect('/fight?room_id='+createdroom.room_id);
		}
        
    } catch (error) {
        next(error)
    }
}


exports.fightRoom = async (req, res, next) => {
    try {
		var queryid = req.query.room_id || ''
        const { user } = req
		
		const getroomdetail = await Room.findOne({
            where: {
                room_id: queryid
            }
        });
		
		const getplayeronedetail = await User.findOne({
            where: {
                id: getroomdetail.player_one_id
            }
        });
		const getplayertwodetail = await User.findOne({
            where: {
                id: getroomdetail.player_two_id
            }
        });

        return res.status(200).render('fight', {
            userId: user.id,
			getroomdetail,
			getplayeronedetail,
			getplayertwodetail
        })
    } catch (error) {
        next(error)
    }
}

exports.fightSubmit = async (req, res, next) => {
    try {
		const { user } = req;
        const { room_id, choice } = req.body;
		
		if (!room_id) {
		  throw {
			message: `room id must be valid`,
			code: 400,
			error: `bad request`,
		  };
		}
		if (!choice) {
		  throw {
			message: `please select either one of rps`,
			code: 400,
			error: `bad request`,
		  };
		}

        const isRoomExist = await Room.findOne({
            where: {
                room_id: room_id
            }
        });

        if(isRoomExist){
			if(isRoomExist.rounds <= 3)
			{
				if(isRoomExist.player_one_id == user.id)
				{
					if(isRoomExist.rounds == 1)
					{
						if(isRoomExist.player_two_choice1)
						{
							if(isRoomExist.player_two_choice1 == "r")
							{
								if(choice == "r")
								{
									await Room.update(
										{
											player_one_choice1: choice,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "p")
								{
									await Room.update(
										{
											player_one_choice1: choice,
											player_one_score: isRoomExist.player_one_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "s")
								{
									await Room.update(
										{
											player_one_choice1: choice,
											player_two_score: isRoomExist.player_two_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
							}
							else if(isRoomExist.player_two_choice1 == "p")
							{
								if(choice == "r")
								{
									await Room.update(
										{
											player_one_choice1: choice,
											player_two_score: isRoomExist.player_two_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "p")
								{
									await Room.update(
										{
											player_one_choice1: choice,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "s")
								{
									await Room.update(
										{
											player_one_choice1: choice,
											player_one_score: isRoomExist.player_one_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
							}
							else if(isRoomExist.player_two_choice1 == "s")
							{
								if(choice == "r")
								{
									await Room.update(
										{
											player_one_choice1: choice,
											player_one_score: isRoomExist.player_one_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "p")
								{
									await Room.update(
										{
											player_one_choice1: choice,
											player_two_score: isRoomExist.player_two_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "s")
								{
									await Room.update(
										{
											player_one_choice1: choice,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
							}
						}
						else
						{
							await Room.update(
								{
									player_one_choice1: choice
								},
								{
									where: { room_id: isRoomExist.room_id }
								}
							);
						}
					}
					else if(isRoomExist.rounds == 2)
					{
						if(isRoomExist.player_two_choice2)
						{
							if(isRoomExist.player_two_choice2 == "r")
							{
								if(choice == "r")
								{
									await Room.update(
										{
											player_one_choice2: choice,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "p")
								{
									await Room.update(
										{
											player_one_choice2: choice,
											player_one_score: isRoomExist.player_one_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "s")
								{
									await Room.update(
										{
											player_one_choice2: choice,
											player_two_score: isRoomExist.player_two_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
							}
							else if(isRoomExist.player_two_choice2 == "p")
							{
								if(choice == "r")
								{
									await Room.update(
										{
											player_one_choice2: choice,
											player_two_score: isRoomExist.player_two_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "p")
								{
									await Room.update(
										{
											player_one_choice2: choice,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "s")
								{
									await Room.update(
										{
											player_one_choice2: choice,
											player_one_score: isRoomExist.player_one_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
							}
							else if(isRoomExist.player_two_choice2 == "s")
							{
								if(choice == "r")
								{
									await Room.update(
										{
											player_one_choice2: choice,
											player_one_score: isRoomExist.player_one_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "p")
								{
									await Room.update(
										{
											player_one_choice2: choice,
											player_two_score: isRoomExist.player_two_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "s")
								{
									await Room.update(
										{
											player_one_choice2: choice,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
							}
						}
						else
						{
							await Room.update(
								{
									player_one_choice2: choice
								},
								{
									where: { room_id: isRoomExist.room_id }
								}
							);
						}
					}
					else if(isRoomExist.rounds == 3)
					{
						if(isRoomExist.player_two_choice3)
						{
							if(isRoomExist.player_two_choice3 == "r")
							{
								if(choice == "r")
								{
									await Room.update(
										{
											player_one_choice3: choice,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "p")
								{
									await Room.update(
										{
											player_one_choice3: choice,
											player_one_score: isRoomExist.player_one_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "s")
								{
									await Room.update(
										{
											player_one_choice3: choice,
											player_two_score: isRoomExist.player_two_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
							}
							else if(isRoomExist.player_two_choice3 == "p")
							{
								if(choice == "r")
								{
									await Room.update(
										{
											player_one_choice3: choice,
											player_two_score: isRoomExist.player_two_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "p")
								{
									await Room.update(
										{
											player_one_choice3: choice,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "s")
								{
									await Room.update(
										{
											player_one_choice3: choice,
											player_one_score: isRoomExist.player_one_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
							}
							else if(isRoomExist.player_two_choice3 == "s")
							{
								if(choice == "r")
								{
									await Room.update(
										{
											player_one_choice3: choice,
											player_one_score: isRoomExist.player_one_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "p")
								{
									await Room.update(
										{
											player_one_choice3: choice,
											player_two_score: isRoomExist.player_two_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "s")
								{
									await Room.update(
										{
											player_one_choice3: choice,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
							}
						}
						else
						{
							await Room.update(
								{
									player_one_choice3: choice
								},
								{
									where: { room_id: isRoomExist.room_id }
								}
							);
						}
					}
				}
				else if(isRoomExist.player_two_id == user.id)
				{
					if(isRoomExist.rounds == 1)
					{
						if(isRoomExist.player_one_choice1)
						{
							if(isRoomExist.player_one_choice1 == "r")
							{
								if(choice == "r")
								{
									await Room.update(
										{
											player_two_choice1: choice,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "p")
								{
									await Room.update(
										{
											player_two_choice1: choice,
											player_two_score: isRoomExist.player_two_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "s")
								{
									await Room.update(
										{
											player_two_choice1: choice,
											player_one_score: isRoomExist.player_one_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
							}
							else if(isRoomExist.player_one_choice1 == "p")
							{
								if(choice == "r")
								{
									await Room.update(
										{
											player_two_choice1: choice,
											player_one_score: isRoomExist.player_one_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "p")
								{
									await Room.update(
										{
											player_two_choice1: choice,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "s")
								{
									await Room.update(
										{
											player_two_choice1: choice,
											player_two_score: isRoomExist.player_two_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
							}
							else if(isRoomExist.player_one_choice1 == "s")
							{
								if(choice == "r")
								{
									await Room.update(
										{
											player_two_choice1: choice,
											player_two_score: isRoomExist.player_two_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "p")
								{
									await Room.update(
										{
											player_two_choice1: choice,
											player_one_score: isRoomExist.player_one_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "s")
								{
									await Room.update(
										{
											player_two_choice1: choice,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
							}
						}
						else
						{
							await Room.update(
								{
									player_two_choice1: choice
								},
								{
									where: { room_id: isRoomExist.room_id }
								}
							);
						}
					}
					else if(isRoomExist.rounds == 2)
					{
						if(isRoomExist.player_one_choice2)
						{
							if(isRoomExist.player_one_choice2 == "r")
							{
								if(choice == "r")
								{
									await Room.update(
										{
											player_two_choice2: choice,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "p")
								{
									await Room.update(
										{
											player_two_choice2: choice,
											player_two_score: isRoomExist.player_two_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "s")
								{
									await Room.update(
										{
											player_two_choice2: choice,
											player_one_score: isRoomExist.player_one_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
							}
							else if(isRoomExist.player_one_choice2 == "p")
							{
								if(choice == "r")
								{
									await Room.update(
										{
											player_two_choice2: choice,
											player_one_score: isRoomExist.player_one_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "p")
								{
									await Room.update(
										{
											player_two_choice2: choice,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "s")
								{
									await Room.update(
										{
											player_two_choice2: choice,
											player_two_score: isRoomExist.player_two_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
							}
							else if(isRoomExist.player_one_choice2 == "s")
							{
								if(choice == "r")
								{
									await Room.update(
										{
											player_two_choice2: choice,
											player_two_score: isRoomExist.player_two_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "p")
								{
									await Room.update(
										{
											player_two_choice2: choice,
											player_one_score: isRoomExist.player_one_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "s")
								{
									await Room.update(
										{
											player_two_choice2: choice,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
							}
						}
						else
						{
							await Room.update(
								{
									player_two_choice2: choice
								},
								{
									where: { room_id: isRoomExist.room_id }
								}
							);
						}
					}
					else if(isRoomExist.rounds == 3)
					{
						if(isRoomExist.player_one_choice3)
						{
							if(isRoomExist.player_one_choice3 == "r")
							{
								if(choice == "r")
								{
									await Room.update(
										{
											player_two_choice3: choice,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "p")
								{
									await Room.update(
										{
											player_two_choice3: choice,
											player_two_score: isRoomExist.player_two_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "s")
								{
									await Room.update(
										{
											player_two_choice3: choice,
											player_one_score: isRoomExist.player_one_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
							}
							else if(isRoomExist.player_one_choice3 == "p")
							{
								if(choice == "r")
								{
									await Room.update(
										{
											player_two_choice3: choice,
											player_one_score: isRoomExist.player_one_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "p")
								{
									await Room.update(
										{
											player_two_choice3: choice,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "s")
								{
									await Room.update(
										{
											player_two_choice3: choice,
											player_two_score: isRoomExist.player_two_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
							}
							else if(isRoomExist.player_one_choice3 == "s")
							{
								if(choice == "r")
								{
									await Room.update(
										{
											player_two_choice3: choice,
											player_two_score: isRoomExist.player_two_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "p")
								{
									await Room.update(
										{
											player_two_choice3: choice,
											player_one_score: isRoomExist.player_one_score + 1,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
								else if(choice == "s")
								{
									await Room.update(
										{
											player_two_choice3: choice,
											rounds: isRoomExist.rounds + 1
										},
										{
											where: { room_id: isRoomExist.room_id }
										}
									);
								}
							}
						}
						else
						{
							await Room.update(
								{
									player_two_choice3: choice
								},
								{
									where: { room_id: isRoomExist.room_id }
								}
							);
						}
					}
				}
				return res.status(301).redirect('/fight?room_id='+isRoomExist.room_id);
			}
			else
			{
				throw {
					message: `Already 3 rounds of games`,
					code: 400,
					error: `bad request`,
				};
			}
        }
		else
		{
			throw {
				message: `room id must be valid`,
				code: 400,
				error: `bad request`,
			};
		}
        
    } catch (error) {
        next(error)
    }
}