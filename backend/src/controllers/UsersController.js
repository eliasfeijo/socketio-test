const { models } = require('../database/index');
const _ = require('lodash');
const bcrypt = require('bcrypt');

module.exports = {
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
        user.password_digest = password;
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