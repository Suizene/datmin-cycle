// controllers/motorcycleController.js

const { Motorcycle, Part } = require('../models');

/* ======================================================
   GET ALL MOTORCYCLES
====================================================== */
exports.getMotorcycles = async (req, res) => {
  try {
    const motorcycles = await Motorcycle.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Part, as: 'parts' }
      ],
      order: [
        ['createdAt', 'DESC'],
        [{ model: Part, as: 'parts' }, 'createdAt', 'DESC']
      ]
    });

    res.json(motorcycles);
  } catch (error) {
    console.error("GET MOTORCYCLES ERROR:", error);
    res.status(500).json({ message: "Gagal memuat data motor" });
  }
};

/* ======================================================
   GET MOTORCYCLE BY ID
====================================================== */
exports.getMotorcycleById = async (req, res) => {
  try {
    console.log('Fetching motorcycle with ID:', req.params.motorcycleId);

    const motorcycle = await Motorcycle.findOne({
      where: {
        id: req.params.motorcycleId,
        userId: req.user.id
      },
      include: [
        {
          model: Part,
          as: 'parts',
          attributes: ['id', 'name', 'kmReplaced', 'nextReplacementKm', 'lastReplaced']
        }
      ],
      order: [
        ['createdAt', 'DESC'],
        [{ model: Part, as: 'parts' }, 'createdAt', 'DESC']
      ]
    });

    if (!motorcycle) {
      return res.status(404).json({ message: "Motor tidak ditemukan" });
    }

    res.json(motorcycle);
  } catch (error) {
    console.error("GET MOTOR ERROR:", error);
    res.status(500).json({ message: "Gagal memuat detail motor" });
  }
};

/* ======================================================
   ADD MOTORCYCLE
====================================================== */
exports.addMotorcycle = async (req, res) => {
  try {
    const { type, brand, model, year, currentKm } = req.body;

    const motorcycle = await Motorcycle.create({
      type,
      brand,
      model,
      year,
      currentKm,
      userId: req.user.id
    });

    // Insert default parts
    await addDefaultParts(motorcycle.id, type);

    const newMoto = await Motorcycle.findByPk(motorcycle.id, {
      include: [{ model: Part, as: 'parts' }],
      order: [
        [{ model: Part, as: 'parts' }, 'createdAt', 'DESC']
      ]
    });

    res.status(201).json(newMoto);
  } catch (error) {
    console.error("ADD MOTOR ERROR:", error);
    res.status(500).json({ message: "Gagal menambah motor" });
  }
};

/* ======================================================
   UPDATE MOTORCYCLE
====================================================== */
exports.updateMotorcycle = async (req, res) => {
  try {
    console.log("UPDATE REQUEST BODY:", req.body);

    // Accept both licensePlate and plateNumber for backward compatibility
    const { type, brand, model, year, currentKm, plateNumber, licensePlate } = req.body;

    const motorcycle = await Motorcycle.findOne({
      where: {
        id: req.params.motorcycleId,
        userId: req.user.id
      }
    });

    if (!motorcycle) {
      return res.status(404).json({ message: "Motor tidak ditemukan" });
    }

    console.log("Before update:", {
      plateNumber: motorcycle.plateNumber,
      currentKm: motorcycle.currentKm
    });

    // Prepare update data
    const updateData = {
      type,
      brand,
      model,
      year: Number(year),
      currentKm: Number(currentKm) || 0
    };

    // Handle both licensePlate and plateNumber fields
    // Prefer licensePlate if both are provided
    const plateToUpdate = licensePlate !== undefined ? licensePlate : plateNumber;
    
    // Only update plateNumber if it's provided in the request
    if (plateToUpdate !== undefined) {
      updateData.plateNumber = plateToUpdate || null; // Allow setting to null if empty string is passed
      console.log('Updating license plate to:', updateData.plateNumber);
    }

    console.log("Updating with data:", updateData);
    await motorcycle.update(updateData);

    const updated = await Motorcycle.findByPk(req.params.motorcycleId, {
      include: [{
        model: Part,
        as: 'parts'
      }]
    });

    console.log("After update:", {
      plateNumber: updated.plateNumber,
      updatedAt: updated.updatedAt
    });

    res.json(updated);

  } catch (error) {
    console.error("UPDATE MOTOR ERROR:", error);
    res.status(500).json({ message: "Gagal mengupdate motor" });
  }
};

/* ======================================================
   DELETE MOTORCYCLE
====================================================== */
exports.deleteMotorcycle = async (req, res) => {
  try {
    const motorcycle = await Motorcycle.findOne({
      where: {
        id: req.params.motorcycleId,
        userId: req.user.id
      }
    });

    if (!motorcycle) {
      return res.status(404).json({ message: "Motor tidak ditemukan" });
    }

    // Hapus semua parts milik motor
    await Part.destroy({
      where: { motorcycleId: req.params.motorcycleId }
    });

    await motorcycle.destroy();

    res.json({ message: "Motor berhasil dihapus" });
  } catch (error) {
    console.error("DELETE MOTOR ERROR:", error);
    res.status(500).json({ message: "Gagal menghapus motor" });
  }
};

/* ======================================================
   DEFAULT PARTS GENERATOR
====================================================== */
async function addDefaultParts(motorcycleId, type) {
  const parts = [
    { name: 'Oli Gardan', nextReplacementKm: 8000 },
    { name: 'Oli Mesin', nextReplacementKm: 4000 },
    { name: 'Filter Udara', nextReplacementKm: 8000 },
    { name: 'Filter Bensin', nextReplacementKm: 12000 },
    { name: 'Kampas Rem', nextReplacementKm: 20000 },
    { name: 'Minyak Rem', nextReplacementKm: 20000 },
    { name: 'Busi', nextReplacementKm: 12000 }
  ];

  if (type === "matic") {
    parts.push({ name: 'Vanbelt', nextReplacementKm: 24000 });
  }
  if (type === "bebek") {
    parts.push({ name: 'Rantai', nextReplacementKm: 12000 });
  }
  if (type === "manual") {
    parts.push({ name: 'Rantai', nextReplacementKm: 12000 });
    parts.push({ name: 'Kampas Kopling', nextReplacementKm: 30000 });
  }

  const formatted = parts.map(p => ({
    name: p.name,
    kmReplaced: 0,
    nextReplacementKm: p.nextReplacementKm,
    lastReplaced: new Date(),
    motorcycleId
  }));

  await Part.bulkCreate(formatted);
}
