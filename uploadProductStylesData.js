var csv = require('csvtojson');
require('dotenv/config');
const models = require('./model.js')
const db = require('./db.js')


async function uploadProductStyles(jsonObj) {
  try {
    let currentProductId
    let resultsArr = []
    for (let i = 0; i < jsonObj.length; i++) {
      const row = jsonObj[i];
      currentProductId = currentProductId || row.productId
      if (currentProductId !== row.productId || i === jsonObj.length - 1){
        // insert new entry
        let objToInsert = {
          product_id: currentProductId,
          results: resultsArr
        }
        console.log(objToInsert)
        await models.ProductStyles.create(objToInsert);
        // reset data and update current id
        resultsArr = []
        currentProductId = row.productId
      }
      let currentObj = {
        style_id: row.id,
        name: row.name,
        original_price: row.original_price,
        sale_price: row.sale_price,
        default: row.default_tyle,
        photos: [{}],
        skus: {}
      }
      resultsArr.push(currentObj)
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function uploadData() {
  try {
    await db();
    const styleJson = await csv().fromFile('./sampleData/stylesSample.csv');
    await uploadProductStyles(styleJson);
  } catch (error) {
    console.log(error);
  }
}

uploadData()