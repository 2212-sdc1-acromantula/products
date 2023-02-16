var mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  slogan: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  default_price: {
    type: String,
    required: true
  },
  related_products: [Number]
});


const productStylesSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true
  },
  results: [
    {
      style_id: {
        type: Number,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      original_price: {
        type: String,
        required: true
      },
      sale_price: String,
      default: Boolean,
      photos: [{
        thumbnail_url: String,
        url: String
      }],
      skus: {
        type: Map,
        of: new mongoose.Schema({
          size: {
            type: String,
            required: true
          },
          quantity: {
            type: Number,
            required: true
          },
        }),
      }
    }]
  })


const models = {
  Product: mongoose.model('Product', productSchema),
  ProductStyles: mongoose.model('ProductStyles', productStylesSchema)
}

module.exports = models;
