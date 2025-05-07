const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant');
const auth = require('../middleware/auth'); // Ensure this middleware checks JWT

// POST /api/v1/plants - Add new plant (authenticated)
router.post('/', auth, async (req, res) => {
  try {
    const { name, species } = req.body;
    const plant = new Plant({
      name,
      species,
      userId: req.user.id,
    });
    await plant.save();
    res.status(201).json(plant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add plant' });
  }
});

// GET /api/v1/plants - Get user's plants (authenticated)
router.get('/', auth, async (req, res) => {
  try {
    const plants = await Plant.find({ userId: req.user.id });
    res.status(200).json(plants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plants' });
  }
});

// POST /api/v1/plants/:plantId/reminders
router.post('/:plantId/reminders', auth, async (req, res) => {
  try {
    const { plantId } = req.params;
    const { type, interval, unit } = req.body;

    const plant = await Plant.findOne({ _id: plantId, userId: req.user.id });
    if (!plant) return res.status(404).json({ error: 'Plant not found' });

    const reminder = { type, interval, unit };
    plant.reminders.push(reminder);
    await plant.save();

    res.status(200).json({ message: 'Reminder added', plant });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add reminder' });
  }
});


// GET /api/v1/plants?name=Aloe&species=Succulent
router.get('/', auth, async (req, res) => {
  try {
    const { name, species } = req.query;
    const filter = { userId: req.user.id };

    if (name) {
      filter.name = { $regex: name, $options: 'i' }; // case-insensitive partial match
    }

    if (species) {
      filter.species = { $regex: species, $options: 'i' };
    }

    const plants = await Plant.find(filter);
    res.status(200).json(plants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plants' });
  }
});


module.exports = router;
