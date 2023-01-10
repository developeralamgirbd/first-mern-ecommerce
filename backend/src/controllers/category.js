const Category = require('../models/Category');
const Product = require('../models/Product');
const slugify = require('slugify');

exports.create = async (req, res) => {
    try {
        const { name } = req.body;
        // if category name is empty after trim
        if (!name.trim()) {
            return res.json({ error: "Name is required" });
        }
        // check category is exits
        const existingCategory = await Category.findOne({ name });
        // if category exits
        if (existingCategory) {
            return res.json({ error: "Category Already exists" });
        }

        // create a new category with seo base url
        const category = await new Category({ name, slug: slugify(name) }).save();
        res.status(201).json(category);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err.message);
    }
};


exports.update = async (req, res) => {
    try {
        // destructure category name from body and get category id from url params
        const { name } = req.body;
        const { categoryId } = req.params;
        // find by category id and update
        const category = await Category.findByIdAndUpdate(
            categoryId,
            {
                name,
                slug: slugify(name),
            },
            { new: true }
        );
        res.status(201).json(category);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
};

exports.remove = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const removed = await Category.findByIdAndDelete(categoryId);
        res.status(200).json(removed);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
};


exports.list = async (req, res) => {
    try {
        // get all category
        const all = await Category.find({});
        res.status(200).json(all);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
};

// get category by slug
exports.read = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        res.status(200).json(category);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
};

// get products by category slug
exports.productsByCategory = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        const products = await Product.find({ category }).populate("category");

        res.status(200).json({
            category,
            products,
        });
    } catch (err) {
        console.log(err);
    }
};