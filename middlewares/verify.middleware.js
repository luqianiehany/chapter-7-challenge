require('dotenv').config()

const jwt = require('jsonwebtoken')
const {JWT_TOKEN} = process.env
const {User} = require('../models')

exports.verify = async (req, res, next) => {
    try {
        const {authorization} = req.headers

        if (!authorization) {
            throw {
                code: 401,
                message: 'invalid token',
                error: 'unauthorized'
            }
        }

        const token = authorization.split(' ')[1]
        const isValidToken = jwt.verify(token, JWT_TOKEN, {})

        if (!isValidToken) {
            throw {
                code: 401,
                message: 'invalid token',
                error: 'unauthorized'
            }
        }

        const user = await User.findOne({
            where: {
                id: isValidToken.userId
            }
        })

        if (!user) {
            throw {
                code: 401,
                message: 'invalid token',
                error: 'unauthorized'
            }
        }

        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}