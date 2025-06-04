const db = require('../Models');
const Specialty = db.specialty;

// Create a new specialty
exports.create = async (req, res) => {
  try {
    const specialty = await Specialty.create(req.body);
    return res.status(201).json(specialty);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all specialties
exports.findAll = async (req, res) => {
  try {
    const specialties = await Specialty.findAll();
    return res.status(200).json(specialties);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get specialty by ID
exports.findOne = async (req, res) => {
  try {
    const specialty = await Specialty.findByPk(req.params.id);
    
    if (!specialty) {
      return res.status(404).json({ message: 'Specialty not found' });
    }
    
    return res.status(200).json(specialty);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update specialty
exports.update = async (req, res) => {
  try {
    const numUpdated = await Specialty.update(req.body, {
      where: { specialtyId: req.params.id }
    });
    
    if (numUpdated[0] === 0) {
      return res.status(404).json({ message: 'Specialty not found' });
    }
    
    return res.status(200).json({ message: 'Specialty updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete specialty
exports.delete = async (req, res) => {
  try {
    const numDeleted = await Specialty.destroy({
      where: { specialtyId: req.params.id }
    });
    
    if (numDeleted === 0) {
      return res.status(404).json({ message: 'Specialty not found' });
    }
    
    return res.status(200).json({ message: 'Specialty deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}; 