const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { Op } = require("sequelize");
const { User } = require('../models');


dotenv.config();

const hashPassword = (password) => {
    const salt_rounds = Number(process.env.SALT_ROUNDS);
    return bcrypt.hashSync(password, salt_rounds);
}

const allUsers = async (_req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });

        if(users.length === 0){
            return res.json({message: 'Users Not Found'});
        }

        res.status(200).json(users);
    }catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }

}

const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });

        if(!user){
            return res.json({message: 'User Not Found'});
        }

        res.status(200).json(user);
    }catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

const createUser = async (req, res) => {
    try{
        const user = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            birthdate: req.body.birthdate,
            password: hashPassword(req.body.password),
        }

        if(!user.name || !user.email || !user.birthdate || !user.password){
            return res.status(404).json({message: 'fill all input please.'});
        }

        const userExist = await User.findOne({
            where: {
                [Op.or]: [
                  { name: req.body.name },
                  { email: req.body.email }
                ]
            }
        });

        if(userExist){
            return res.status(409).json(
                {message: 'This name or email already exist'}
            );
        }

        const newUser = await User.create(user);

        res.status(201).json(newUser);
    }catch(err){
        res.status(500).json({ error: 'Something went wrong' });
    }
}

const updateUser = async (req, res) => {
    try {
        const {name, email, birthdate, role} = req.body;

        let user = await User.findOne({
            where: {
                id: req.params.id
            },
            attributes: { exclude: ['password'] }
        });

        if(!user){
            return res.json({message: 'User not found'});
        }

        user.name = name;
        user.email = email;
        user.birthdate = birthdate;
        user.role = role;
        user = await user.save();

        res.status(200).json(user) ;
    }catch(err){
        res.status(500).json({ error: 'Something went wrong' });
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if(!user){
            return res.json("Not found");
        }
        await user.destroy()

        res.status(200).json({ message: 'User deleted!' });
    }catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }

}

const login = async (req, res) => {
    try {
        const user = await User.findOne({where: {email: req.body.email}});

        if(!req.body.email || !req.body.password){
            return res.status(404).json({message: 'fill input email & password please.'});
        }

        if (user){
            const isValid = bcrypt.compareSync(req.body.password, user.password)

            if (isValid){
                const token = jwt.sign(
                    {id: user.id, role: user.role},
                    process.env.JWT_SECRET
                )

                return res.json({
                    token: token,
                    token_type: 'Bearer',
                    role: user.role,
                    id: user.id,
                    email: user.email
                });
            }
        }else{
            return res.status(404).json("email not exist")
        }

        return res.status(401).json('the password do not match.');
    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Something went wrong' });
    }
}


const userRoutes = (app) => {
    app.get('/users', allUsers)
    app.post('/users',  createUser)
    app.get('/users/:id', getUserById)
    app.post('/users/login', login)
    app.patch('/users/:id',  updateUser)
    app.delete('/users/:id', deleteUser)
}

module.exports = userRoutes;
