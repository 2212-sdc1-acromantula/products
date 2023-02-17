var mongoose = require('mongoose');
var csv = require('csvtojson');
require('dotenv/config');
const { ProductStyles } = require('./model.js');
const db = require('./db.js');

async function uploadSkus(jsonObj) {
  for (let i = 0; i < jsonObj.length; i++) {
    const row = jsonObj[i];
    let skusObj = {
      size: row.size,
      quantity: row.quantity,
    };
    try {
      await ProductStyles.findOneAndUpdate(
        { 'results.style_id': row.styleId },
        { $set: { ['results.$.skus.' + row.id]: skusObj } }
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

async function uploadData() {
  try {
    await db();
    const skusJson = await csv().fromFile('./sampleData/skusSample.csv');
    console.time('skus data');
    await uploadSkus(skusJson);
    console.log('Skus upload complete!');
    console.timeEnd('skus data');
  } catch (error) {
    console.log(error);
  }
}

uploadData();
