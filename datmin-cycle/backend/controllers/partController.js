// In partController.js
const { Part, Motorcycle } = require('../models');

// Debug endpoint to list all parts
exports.listAllParts = async (req, res) => {
  try {
    const parts = await Part.findAll({
      include: [{
        model: Motorcycle,
        as: 'motorcycle',
        attributes: ['id', 'brand', 'model']
      }],
      order: [
        ['motorcycle_id', 'ASC'],
        ['name', 'ASC']
      ]
    });
    res.json(parts);
  } catch (error) {
    console.error('Error listing parts:', error);
    res.status(500).json({ message: 'Error fetching parts', error: error.message });
  }
};


// GET /motorcycles/:motorcycleId/parts
exports.getParts = async (req, res) => {
  try {
    const motorcycle = await Motorcycle.findOne({
      where: { 
        id: req.params.motorcycleId,
        userId: req.user.id 
      }
    });

    if (!motorcycle) {
      return res.status(404).json({ message: 'Motor tidak ditemukan' });
    }

    const parts = await Part.findAll({
      where: { motorcycleId: req.params.motorcycleId },
      order: [['createdAt', 'DESC']]
    });

    return res.json(parts);
  } catch (err) {
    console.error("GET PARTS ERROR:", err);
    return res.status(500).json({ 
      message: "Gagal memuat data part",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// POST /motorcycles/:motorcycleId/parts
exports.addPart = async (req, res) => {
  try {
    const motorcycle = await Motorcycle.findOne({
      where: { 
        id: req.params.motorcycleId,
        userId: req.user.id 
      }
    });

    if (!motorcycle) {
      return res.status(404).json({ message: 'Motor tidak ditemukan' });
    }

    const { name, kmReplaced = 0, nextReplacementKm, lastReplaced } = req.body;

    if (!name || !nextReplacementKm) {
      return res.status(400).json({
        message: "Nama part dan nextReplacementKm wajib diisi"
      });
    }

    const newPart = await Part.create({
      name,
      kmReplaced: Number(kmReplaced),
      nextReplacementKm: Number(nextReplacementKm),
      lastReplaced: lastReplaced ? new Date(lastReplaced) : new Date(),
      motorcycleId: req.params.motorcycleId
    });

    return res.status(201).json(newPart);
  } catch (err) {
    console.error("ADD PART ERROR:", err);
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Validasi gagal",
        errors: err.errors ? err.errors.map(e => e.message) : [err.message]
      });
    }
    return res.status(500).json({ 
      message: "Gagal menambah part",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// PUT /motorcycles/:motorcycleId/parts/:partId
exports.updatePart = async (req, res) => {
  try {
    const motorcycle = await Motorcycle.findOne({
      where: { 
        id: req.params.motorcycleId,
        userId: req.user.id 
      }
    });

    if (!motorcycle) {
      return res.status(404).json({ message: 'Motor tidak ditemukan' });
    }

    const part = await Part.findOne({
      where: { 
        id: req.params.partId,
        motorcycleId: req.params.motorcycleId
      }
    });

    if (!part) {
      return res.status(404).json({ message: "Part tidak ditemukan" });
    }

    const { name, kmReplaced, nextReplacementKm, lastReplaced } = req.body;

    await part.update({
      name: name ?? part.name,
      kmReplaced: kmReplaced !== undefined ? Number(kmReplaced) : part.kmReplaced,
      nextReplacementKm: nextReplacementKm !== undefined ? Number(nextReplacementKm) : part.nextReplacementKm,
      lastReplaced: lastReplaced ? new Date(lastReplaced) : part.lastReplaced
    });

    return res.json(part);
  } catch (err) {
    console.error("UPDATE PART ERROR:", err);
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Validasi gagal",
        errors: err.errors ? err.errors.map(e => e.message) : [err.message]
      });
    }
    return res.status(500).json({ 
      message: "Gagal update part",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// DELETE /motorcycles/:motorcycleId/parts/:partId
exports.deletePart = async (req, res) => {
  try {
    const motorcycle = await Motorcycle.findOne({
      where: { 
        id: req.params.motorcycleId,
        userId: req.user.id 
      }
    });

    if (!motorcycle) {
      return res.status(404).json({ message: 'Motor tidak ditemukan' });
    }

    const part = await Part.findOne({
      where: { 
        id: req.params.partId,
        motorcycleId: req.params.motorcycleId
      }
    });

    if (!part) {
      return res.status(404).json({ message: "Part tidak ditemukan" });
    }

    await part.destroy();
    return res.json({ message: "Part berhasil dihapus" });
  } catch (err) {
    console.error("DELETE PART ERROR:", err);
    return res.status(500).json({ 
      message: "Gagal menghapus part",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};