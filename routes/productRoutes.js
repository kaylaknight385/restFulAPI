const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

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
