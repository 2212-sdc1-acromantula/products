var mongoose = require('mongoose');
var csv = require('csvtojson');
require('dotenv/config');
const models = require('./model.js')
const db = require('./db.js')


async function uploadProducts(jsonObj) {
  const products = jsonObj.map((item) => ({
    id: item.id,
    name: item.name,
    slogan: item.slogan,
    description: item.description,
    category: item.category,
    default_price: item.default_price,
    related_products: []
  }));
  try {
    await models.Products.insertMany(products);
    console.log('Data added to the database!');
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function uploadRelatedProducts(jsonObj) {
  let relatedArr = [];
  let current_product_id = 1;
  try {
    for (let i = 0; i < jsonObj.length; i++) {
      const row = jsonObj[i];
      if (row.current_product_id === current_product_id) {
        relatedArr.push(Number(row.related_product_id));
      } else {
        // upload existing array if id's don't match
        await models.Products.findOneAndUpdate(
          { id: current_product_id },
          { related_products: relatedArr },
          { upsert: true }
        );
        console.log('Data added to the database!');
        // reset array and update product id
        relatedArr = [];
        current_product_id = row.current_product_id;
        relatedArr.push(row.related_product_id);
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// upload product data
async function uploadData() {
  try {
    await db();
    const productJson = await csv().fromFile('./sampleData/productSample.csv');
    await uploadProducts(productJson);
    const relatedJson = await csv().fromFile('./sampleData/relatedSample.csv');
    await uploadRelatedProducts(relatedJson);
  } catch (error) {
    console.log(error);
  }
}

uploadData();



// example of batch size: models.Product.insertMany(products, { batchSize: 1000 })
// if this doesn't work, there are scripts to run in the terminal that can run in diff instances
// leave a console.log to make sure you know things are running