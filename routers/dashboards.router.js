const router = require('express').Router()

const { viewDashboard } = require('../controllers/dashboards.controller')
const restrict = require('../middlewares/restrict.middleware')

router.get('/dashboard', restrict, viewDashboard)

module.exports = router