var mongoose = require('mongoose');
var csv = require('csvtojson');
require('dotenv/config');
const { Products } = require('../model.js');
const db = require('../db.js');

async function uploadFeatures(jsonObj) {
  for (let i = 0; i < jsonObj.length; i++) {
    const row = jsonObj[i];
    let featuresObj = {
      feature: row.feature,
      value: row.value,
    };
    try {
      await Products.findOneAndUpdate(
        { id: row.product_id },
        { $push: { features: featuresObj } }
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

// real data
async function uploadProductFeatures(csv1) {
  try {
    await db();
    const photosJson = await csv().fromFile(csv1);
    console.time('product features');
    console.log('uploading features...');
    await uploadFeatures(photosJson);
    console.timeEnd('product features');
    console.log('Features upload complete!');
  } catch (error) {
    console.log(error);
  }
}

module.exports = { uploadProductFeatures };
