var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const cors = require('cors');
var mongoose = require('mongoose');
var multer = require('multer');
var csv = require('csvtojson');
require('dotenv/config');
const models = require('./model.js')
var upload = multer({ dest: 'uploads/' });


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/SDC', { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.set('strictQuery', false);
    console.log('Connected to the database!');
  } catch (error) {
    console.log(error);
    throw error;
  }
}

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
    await models.Product.insertMany(products);
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
        await models.Product.findOneAndUpdate(
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
    await connectToDatabase();
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
