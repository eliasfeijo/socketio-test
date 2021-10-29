const { models } = require('../database/index');

module.exports = {
  async create(req, res) {

    let { name, email, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ message: "Fields {email, name, password} required" })
    }

    try {
      const user = await models.User.create({
        email: email,
        name: name,
        password_digest: password,
      });
      res.status(201).json(user.toJSON());
    }
    catch(error) {
      res.status(400).json(error)
    };

    return;
  },

  async getAll(req, res) {
    try {
      const users = await models.User.findAll()
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
      res.status(200).json(user.toJSON());
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
        res.status(200).json(user.toJSON());
      } catch (error) {
        res.status(404).json(error);
      }
    }
    catch(error) {
      res.status(404).json( { message: `User with id ${id} not found` });
    };

    return;
  },
};