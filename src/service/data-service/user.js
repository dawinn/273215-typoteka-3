'use strict';

const {User} = require(`../models`);
const bCrypt = require(`bcrypt`);
const {Sequelize} = require(`sequelize`);
const SALT_ROUNDS = 13;

class UserService {
  async create(user) {
    try {
      user.password = await bCrypt.hash(user.password, SALT_ROUNDS);
      const newUser = await User.create(user);
      return newUser.toJSON();
    } catch (error) {
      return null;
    }
  }

  async drop(userId) {
    const deletedUserCount = await User.destroy({
      where: {id: userId}
    });

    return !!deletedUserCount;
  }

  async findOne(id) {
    const user = await User.findByPk(id);

    if (!user) {
      return null;
    }

    return user.toJSON();
  }

  async findByEmail(email) {
    const user = await User.findOne({
      where: {email}
    });

    const author = await User.findOne({
      attributes: [
        [Sequelize.fn(`MIN`, Sequelize.col(`id`)), `id`],
      ],
    });

    if (!user) {
      return null;
    }

    return {
      ...user.toJSON(),
      isAuthor: user.id === author.id,
    };
  }

  async checkUser(user, password) {
    const match = await bCrypt.compare(password, user.password);
    return match;
  }
}

module.exports = UserService;
