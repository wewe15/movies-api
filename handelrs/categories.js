const { Category } = require('../models');


const allCategories = async (_req, res) => {
    try {
        const categories = await Category.findAll();

        if(categories.length === 0) {
            return res.json({message: 'Categories not found'});
        }

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({error: 'Somthing went wrong'});
    }
}

const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if(!category) {
            return res.json({message: 'Category not found'});
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({error: 'Somthing went wrong'});
    }
}

const createCategory = async (req, res) => {
    try {
        const category = {
            title: req.body.title
        }

        if(!category.title) {
            return res.status(404).json({message: 'fill title please'});
        }

        const newCategory = await Category.create(category);

        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({error: 'Somthing went wrong'});
    }
}

const updateCategory = async (req, res) => {
    try {
        const {title} = req.body;

        let category = await Category.findByPk(req.params.id);

        if(!category) {
            return res.json({message: 'Category not found'});
        }

        category.title = title;
        category = await category.save();

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({error: 'Somthing went wrong'});
    }
}

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if(!category) {
            res.json({message: 'Category not found'});
        }

        await category.destroy();

        res.status(200).json({message: 'Category deleted!'});
    } catch (error) {

    }
}

const categoriesRoutes = (app) => {
    app.get('/categories', allCategories)
    app.post('/categories',  createCategory)
    app.get('/categories/:id', getCategoryById)
    app.patch('/categories/:id',  updateCategory)
    app.delete('/categories/:id', deleteCategory)
}

module.exports = categoriesRoutes;
