// buat controller untuk load UI register
require('dotenv').config()

const { User, UserRole, sequelize } = require("../models");
const passport = require('../utils/passport')
const jwt = require('jsonwebtoken')
const { QueryTypes } = require('sequelize')

const bcrypt = require("bcrypt");

exports.viewRegister = async (req, res, next) => {
    // render tampilan UI register
    return res.render('register')
}

exports.viewLogin = async (req, res, next) => {
    return res.render('login')
}

exports.register = async (req, res, next) => {
    try {
        // ambil email, fullName, password dari body
        const { fullName, email, password, roleName } = req.body;

        // cek apakah user sudah terbuat sebelumnya
        const isExist = await User.findOne({
            where: {
                email
            },
            attributes: ['id']
        });

        // jika sudah maka akan kirim respon error 'user already registered'
        if(isExist){
            throw{
                message: `user already registered`,
                code: 400,
                error: `bad request`
            }
        }

        // hash password menggunakan bcrypt
        const passwordHash = await bcrypt.hash(password, 12);

        const conditions = {
            include: []
        }

        if (roleName) {
            conditions.include.push({
                model: UserRole,
                as: 'role'
            })
        }

        // masukan email, fullName, hashedPassword. dan role ke db
        await User.create({
            email,
            fullName,
            password: passwordHash,
            role: {
                name: roleName
            }
        }, conditions)

        // kirim response json berupa token
        return res.status(200).json({
            message: 'Register successful, please login at http://localhost:2100/login',
            code: 200,
        })
    } catch (error) {
        next(error)
    }
}

exports.login = async (req, res, next) => {
    try {
        const { authorization } = req.headers

        if (authorization) {
            const bearerToken = authorization.split(' ')[1]
    
            try {
                const isValidToken = jwt.verify(bearerToken, process.env.JWT_TOKEN, {})
                if (isValidToken && isValidToken.userId) {
                    // token ini valid
                    // kirim respon berhasil login
                    return res.status(200).json({
                        message: 'Anda berhasil login',
                        code: 200,
                    })    
                }
            } catch (error) {

            }
        }

        // ambil email dan password dari req.body
        const { email, password } = req.body

        // cek apakah user dengan email tsb ada atau tidak
        const isExist = await User.findOne({
            where: {
                email,
            },
            include: [
                {
                    model: UserRole,
                    as: 'role'
                }
            ]
        })

        // jika tidak ada maka respon error user not found
        if (!isExist) {
            throw {
                message: `User not found`,
                code: 404,
                error: `bad request`,
            }
        }
        // jika ada maka compare password dengan password dari db
        const isMatch = await bcrypt.compare(password, isExist.password)

        // jika hasil comparenya salah, maka response error invalid password
        if (!isMatch) {
            throw {
                message: `invalid password`,
                code: 404,
                error: `bad request`,
            }
        }
        // jika benar maka generate token
        const token = jwt.sign({ userId: isExist.id, roleName: isExist.role.name }, process.env.JWT_TOKEN, {expiresIn: '7 days'})

        // kirim token sebagai response
        return res.status(200).json({
            message: 'success login',
            code: 200,
            data: {
                token
            }
        })    
    } catch (error) {
        next(error)
    }
}

exports.whoiami = async (req, res, next) => {
    try {
        const { user } = req
        const data = await sequelize.query('SELECT * FROM users', {type: QueryTypes.SELECT})
        console.log(data)
        return res.status(200).json({
            code: 200,
            message: 'success verify user',
            data: {
                fullName: user.fullName,
                email: user.email
            }
        })
    } catch (error) {
        next(error)
    }
}