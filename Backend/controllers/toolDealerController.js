const ToolDealer = require('../models/toolDealerModel');

exports.createToolDealer = async (req, res) => {
    try {
        const dealer = new ToolDealer(req.body);
        await dealer.save();
        res.status(201).json(dealer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getToolDealers = async (req, res) => {
    try {
        const dealers = await ToolDealer.find();
        res.json(dealers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getToolDealerById = async (req, res) => {
    try {
        const dealer = await ToolDealer.findById(req.params.id);
        if (!dealer) return res.status(404).json({ error: 'Not found' });
        res.json(dealer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateToolDealer = async (req, res) => {
    try {
        const dealer = await ToolDealer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!dealer) return res.status(404).json({ error: 'Not found' });
        res.json(dealer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteToolDealer = async (req, res) => {
    try {
        const dealer = await ToolDealer.findByIdAndDelete(req.params.id);
        if (!dealer) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};