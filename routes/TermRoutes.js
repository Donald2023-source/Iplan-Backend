const express = require('express');
const router = express.Router();
const Term = require('../models/Term');

// Create a new term
router.post('/', async (req, res) => {
  try {
    const { name, startDate, endDate, sessionId } = req.body;

    if (!name || !startDate || !endDate || !sessionId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newTerm = new Term({
      name,
      startDate,
      endDate,
      sessionId
    });

    await newTerm.save();
    res.status(201).json(newTerm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all terms
router.get('/', async (req, res) => {
  try {
    const terms = await Term.find().populate('sessionId');
    res.status(200).json(terms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single term by ID
router.get('/:id', async (req, res) => {
  try {
    const term = await Term.findById(req.params.id).populate('sessionId');
    if (!term) {
      return res.status(404).json({ error: 'Term not found' });
    }
    res.status(200).json(term);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a term by ID
router.put('/:id', async (req, res) => {
  try {
    const { name, startDate, endDate, sessionId } = req.body;

    if (!name || !startDate || !endDate || !sessionId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const term = await Term.findByIdAndUpdate(
      req.params.id,
      { name, startDate, endDate, sessionId },
      { new: true, runValidators: true }
    );

    if (!term) {
      return res.status(404).json({ error: 'Term not found' });
    }

    res.status(200).json(term);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a term by ID
router.delete('/:id', async (req, res) => {
  try {
    const term = await Term.findByIdAndDelete(req.params.id);

    if (!term) {
      return res.status(404).json({ error: 'Term not found' });
    }

    res.status(200).json({ message: 'Term deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
