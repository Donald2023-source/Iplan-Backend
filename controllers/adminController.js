const Term = require('../models/Term');

exports.createTerm = async (req, res) => {
    try {
        const {name, startDate, endDate} = req.body;
        const term = new Term ({name, startDate, endDate});
        await term.save();
        res.Status(201).json(term);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

exports.getAllTerms = async (req, res) => {
    try {
        const terms = await Term.find();
        res.status(200).json(terms);
    } catch(err) {
        res.status(500).json({message: err.message});
    }
};