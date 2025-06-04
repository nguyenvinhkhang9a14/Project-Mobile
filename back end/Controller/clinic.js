const db = require('../Models');
const Clinic = db.clinic;

// Create a new clinic
exports.create = async (req, res) => {
  try {
    const clinic = await Clinic.create(req.body);
    return res.status(201).json(clinic);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all clinics
exports.findAll = async (req, res) => {
  try {
    const clinics = await Clinic.findAll();
    return res.status(200).json(clinics);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get clinic by ID
exports.findOne = async (req, res) => {
  try {
    const clinic = await Clinic.findByPk(req.params.id);
    
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    
    return res.status(200).json(clinic);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update clinic
exports.update = async (req, res) => {
  try {
    const numUpdated = await Clinic.update(req.body, {
      where: { clinicId: req.params.id }
    });
    
    if (numUpdated[0] === 0) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    
    return res.status(200).json({ message: 'Clinic updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete clinic
exports.delete = async (req, res) => {
  try {
    const numDeleted = await Clinic.destroy({
      where: { clinicId: req.params.id }
    });
    
    if (numDeleted === 0) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    
    return res.status(200).json({ message: 'Clinic deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}; 