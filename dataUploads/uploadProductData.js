var mongoose = require('mongoose');
var csv = require('csvtojson');
require('dotenv/config');
const { Products } = require('../model.js');
const db = require('../db.js');

async function uploadProducts(jsonObj) {
  for (let i = 0; i < jsonObj.length; i++) {
    const row = jsonObj[i];
    let product = {
      id: row.id,
      name: row.name,
      slogan: row.slogan,
      description: row.description,
      category: row.category,
      default_price: row.default_price,
      related_products: [],
    };
    try {
      await Products.create(product);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

async function uploadRelatedProducts(jsonObj) {
  let relatedArr = [];
  let current_product_id = 1;
  for (let i = 0; i < jsonObj.length; i++) {
    const row = jsonObj[i];
    if (row.current_product_id === current_product_id) {
      relatedArr.push(Number(row.related_product_id));
    }
    if (
      row.current_product_id !== current_product_id ||
      i === jsonObj.length - 1
    ) {
      try {
        // upload existing array if id's don't match
        await Products.findOneAndUpdate(
          { id: current_product_id },
          { related_products: relatedArr },
          { upsert: true }
        );
      } catch (error) {
        console.log(error);
        throw error;
      }
      // reset array and update product id
      relatedArr = [];
      current_product_id = row.current_product_id;
      relatedArr.push(row.related_product_id);
    }
  }
}

// upload real product data
async function uploadProductData() {
  try {
    await db();
    const productJson = await csv().fromFile('data/product.csv');
    console.log('uploading products...');
    console.time('product data');
    await uploadProducts(productJson);
    console.timeEnd('product data');
    console.log('products finished! uploading related products...');
    console.time('related product data');
    const relatedJson = await csv().fromFile('data/related.csv');
    await uploadRelatedProducts(relatedJson);
    console.log('related products finished!');
    console.timeEnd('related product data');
  } catch (error) {
    console.log(error);
  }
}

// upload sample product data
async function uploadSampleProductData() {
  try {
    await db();
    const productJson = await csv().fromFile('sampleData/productSample.csv');
    console.log('uploading products...');
    console.time('product data');
    await uploadProducts(productJson);
    console.timeEnd('product data');
    console.log('products finished! uploading related products...');
    console.time('related product data');
    const relatedJson = await csv().fromFile('sampleData/relatedSample.csv');
    await uploadRelatedProducts(relatedJson);
    console.timeEnd('related product data');
    console.log('related products finished!');
  } catch (error) {
    console.log(error);
  }
}

module.exports = { uploadProductData, uploadSampleProductData };
