const router = require('express').Router()

const { createRoom, createRoomSubmit, fightRoom, fightSubmit } = require('../controllers/create-room.controller')
const restrict = require('../middlewares/restrict.middleware')

router.get('/create-room', restrict, createRoom)
router.post('/create-room-submit', restrict, createRoomSubmit)
router.get('/fight', restrict, fightRoom)
router.post('/fight-submit', restrict, fightSubmit)

module.exports = router