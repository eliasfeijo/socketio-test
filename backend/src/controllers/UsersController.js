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
  }
};