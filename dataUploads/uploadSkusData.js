var mongoose = require('mongoose');
var csv = require('csvtojson');
require('dotenv/config');
const { ProductStyles } = require('../model.js');
const db = require('../db.js');

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

// upload real data
async function uploadSkusData(csv1) {
  try {
    await db();
    const skusJson = await csv().fromFile(csv1);
    console.time('skus data');
    await uploadSkus(skusJson);
    console.timeEnd('skus data');
    console.log('Skus upload complete!');
  } catch (error) {
    console.log(error);
  }
}

module.exports = { uploadSkusData };
