const User = require('../../models/User');
const Category = require('../../models/Category');
const Product = require('../../models/Product');
const {createRandomUser, createRandomCategory, createRandomProducts} = require("../../helpers/faker/fakerHelper");

exports.fakerUserCreate = async (_req, res)=>{
    try {
        const users = await User.insertMany(createRandomUser());
        res.json(users);

    }catch (e) {
        console.log(e);
    }
}
exports.fakerCategoryCreate = async (_req, res)=>{
    try {
        const categories = await Category.insertMany(createRandomCategory());
        res.json(categories);

    }catch (e) {
        console.log(e);
        res.json(e.message);
    }
}

exports.fakerProductCreate = async (req, res)=>{
    try {
        const {category} = req.body;
        const categories = await Product.insertMany(createRandomProducts(category));
        res.json(categories);

    }catch (e) {
        console.log(e);
        res.json(e.message);
    }
}
