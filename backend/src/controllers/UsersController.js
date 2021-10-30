const { models } = require('../database/index');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWTSecret = 'secret';

module.exports = {
  async refreshToken(req, res) {
    try {
      const user = await models.User.findByPk(req.userId);
      jwt.sign({ id: user.id }, JWTSecret, { expiresIn: '12h' }, (err, token) => {
        if (err) {
          console.log('Error generating token: ', err);
          return res.status(500).json({
              message: "Error generating token"
          })
        } else {
          return res.status(200).json({ token: token, user: _.omit(user.toJSON(), ['password_digest']) });
        }
      });
    }
    catch(error) {
      console.log('Error generating token: ', error);
      return res.status(500).json({
        message: "Error generating token"
    })
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ message: "Fields 'email' or 'password' are missing" })
    }

    try {
      const user = await models.User.findOne({ where: { email: email } });
      const validPassword = await bcrypt.compare(password, user.password_digest);
      if (!validPassword) {
        return res.status(401).json({
          message: "Fields 'email' or 'password' are invalid"
        })
      }
      jwt.sign({ id: user.id }, JWTSecret, { expiresIn: '12h' }, (err, token) => {
        if (err) {
          console.log('Error generating token: ', err);
          return res.status(500).json({
            message: "Error generating token"
          })
        } else {
          return res.status(200).json({ token: token, user: _.omit(user.toJSON(), ['password_digest']) });
        }
      });
    }
    catch(error) {
      return res.status(401).json({
        message: "Fields 'email' or 'password' are invalid"
      })
    };

    return;
  },
  async create(req, res) {

    let { name, email, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ message: "Fields {email, name, password} required" })
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const password_digest = await bcrypt.hash(password, salt);

      const user = await models.User.create({
        email: email,
        name: name,
        password_digest: password_digest,
      });
      res.status(201).json(_.omit(user.toJSON(), ['password_digest']));
    }
    catch(error) {
      res.status(400).json(error)
    };

    return;
  },

  async getAll(req, res) {
    try {
      const usersWithPassword = await models.User.findAll();
      const users = usersWithPassword.map((user) => {
        return _.omit(user.toJSON(), ['password_digest']);
      });
      res.status(200).json(users);
    }
    catch(error) {
      res.status(400).json(error)
    };

    return;
  },

  async getById(req, res) {

    const { id } = req.params;

    if(isNaN(id)) {
      return res.status(400).json({ message: 'Field "id" is invalid' });
    }

    try {
      const user = await models.User.findByPk(id);
      res.status(200).json(_.omit(user.toJSON(), ['password_digest']));
    }
    catch(error) {
      res.status(404).json( { message: `User with id ${id} not found` });
    };

    return;
  },

  async update(req, res) {

    const { id } = req.params;

    if(isNaN(id)) {
      return res.status(400).json({ message: 'Field "id" is invalid' });
    }

    const { email, name, password } = req.body;

    try {
      const user = await models.User.findByPk(id);
      user.email = email ? email : user.email;
      user.name = name ? name : user.name;
      if(password) {
        const salt = await bcrypt.genSalt(10);
        const password_digest = await bcrypt.hash(password, salt);
        user.password_digest = password_digest;
      }
      try {
        await user.save();
        res.status(200).json(_.omit(user.toJSON(), ['password_digest']));
      } catch (error) {
        res.status(400).json(error);
      }
    }
    catch(error) {
      res.status(404).json( { message: `User with id ${id} not found` });
    };

    return;
  },

  async delete(req, res) {

    const { id } = req.params;

    if(isNaN(id)) {
      return res.status(400).json({ message: 'Field "id" is invalid' });
    }

    try {
      const user = await models.User.findByPk(id);
      if(user) {
        try {
          await models.User.destroy({ where: { id: id } });
          res.status(200).json({ message: `User with id ${id} deleted successfully` });
        } catch (error) {
          res.status(400).json(error);
        }
      }
      else {
        res.status(404).json( { message: `User with id ${id} not found` });
      }
    }
    catch(error) {
      res.status(404).json( { message: `User with id ${id} not found` });
    };

    return;
  },
};