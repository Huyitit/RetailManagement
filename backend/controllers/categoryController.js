const { Category } = require('../models');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();

    const result = categories.map(c => ({
      categoryId: c.categoryId,
      categoryName: c.categoryName,
      categoryDescription: c.categoryDescription
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
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      categoryDescription: category.categoryDescription
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
