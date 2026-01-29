const CategoryModel = require('../models/category.model');

exports.getCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.getAll(req.user.id);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        // Basic creation, color defaults to white if not handled in model (not critical for now)
        const category = await CategoryModel.create(name, req.user.id);
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
