const { Category } = require('../models');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();

    const result = categories.map(c => ({
      categoryId: c.id,
      categoryName: c.name
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ status: 'error', message: 'Danh mục không tìm thấy' });
    }

    res.json({
      categoryId: category.id,
      categoryName: category.name
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

