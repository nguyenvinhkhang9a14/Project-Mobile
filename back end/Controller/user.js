// /Controller/user.js
const db = require("../Models");
const User = db.user;

// Create a new user
exports.create = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all users
exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get user by ID
exports.findOne = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update user
exports.update = async (req, res) => {
  try {
    const numUpdated = await User.update(req.body, {
      where: { userId: req.params.id }
    });
    
    if (numUpdated[0] === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete user
exports.delete = async (req, res) => {
  try {
    const numDeleted = await User.destroy({
      where: { userId: req.params.id }
    });
    
    if (numDeleted === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
