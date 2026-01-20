// bring in mongoose so we can work with mongodb. we need her.
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  
  // describe what the product is about - also required so people know what they're buying
  description: {
    type: String,
    required: true,
  },
  
  // the validate function checks if the price is greater than 0
  price: {
    type: Number,
    required: true,
    validate: {
      validator: function(value) {
        return value > 0;
      },
      message: 'Price must be greater than 0',
    },
  },
  
  category: {
    type: String,
    required: true,
  },
  
  inStock: {
    type: Boolean,
    default: true,
  },
  
  tags: [String],
  
  // when was this product created? automatically sets to right now if not specified
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Product = mongoose.model('Product', productSchema);
// export it so other files can use it
module.exports = Product;
