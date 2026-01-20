const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products - SEARCH with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const filter = {};
    // if the user passed a category query param, filter by that category
    if (req.query.category) {
      filter.category = req.query.category;
    }
    // if the user wants products with a minimum price
    if (req.query.minPrice) {
      filter.price = { ...filter.price, $gte: parseFloat(req.query.minPrice) };
    }
    // if the user wants products with a maximum price
    if (req.query.maxPrice) {
      filter.price = { ...filter.price, $lte: parseFloat(req.query.maxPrice) };
    }
    // set up sorting
    let sortOption = {};
    if (req.query.sortBy) {
      if (req.query.sortBy === 'price_asc') {
        // 1 means ascending order (low to high)
        sortOption = { price: 1 };
      } else if (req.query.sortBy === 'price_desc') {
        // -1 means descending order (high to low)
        sortOption = { price: -1 };
      }
    }

    // set up pagination - default to page 1 and 10 results per page
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // calculate how many documents to skip based on the page number
    // if page 1, skip 0. if page 2, skip 10. etc.
    const skip = (page - 1) * limit;

    // build the query: filter + sort + skip + limit
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // also get the total count of products matching the filter (for pagination info)
    const totalProducts = await Product.countDocuments(filter);

    // calculate the total number of pages
    const totalPages = Math.ceil(totalProducts / limit);

    // send back the products and pagination info
    res.json({
      data: products,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        limit: limit,
        totalProducts: totalProducts,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/products - CREATE
router.post('/', async (req, res) => {
  try {
    //create it
    const newProduct = new Product(req.body);
    // save it 
    const savedProduct = await newProduct.save();
    // send back the created product with a 201 (created) status code
    res.status(201).json(savedProduct);
  } catch (error) {
    // if anything fails, send back a 400 error
    res.status(400).json({ error: error.message });
  }
});

// GET /api/products/:id - SHOW
router.get('/:id', async (req, res) => {
  try {
    // find the product by id
    const product = await Product.findById(req.params.id);
    // if the product doesn't exist, send back a 404 not found
    if (!product) {
      return res.status(404).json({ error: 'idk. product not found' });
    }
    // if we found it, send back the product
    res.json(product);
  } catch (error) {
    // if there's an error, send back 500
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/products/:id - UPDATE
router.put('/:id', async (req, res) => {
  try {
    // find the product by id and update it with the new data
    // { new: true } means return the updated product instead of the old one
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    // if the product doesn't exist, send back a 404 not found
    if (!updatedProduct) {
      return res.status(404).json({ error: 'product not found' });
    }
    // send back the updated product
    res.json(updatedProduct);
  } catch (error) {
    // if validation fails or something goes wrong, send back a 400 error
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/products/:id - DELETE
router.delete('/:id', async (req, res) => {
  try {
    // find the product by id and delete it
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    // if the product doesn't exist, send that error
    if (!deletedProduct) {
      return res.status(404).json({ error: 'product not found' });
    }
    
    // if we successfully deleted it, send back a success message
    res.json({ message: 'omg wait...product deleted successfully' });
  } catch (error) {
    // if something goes wrong, send back 500 error
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
