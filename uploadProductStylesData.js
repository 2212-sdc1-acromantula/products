var csv = require('csvtojson');
require('dotenv/config');
const models = require('./model.js');
const db = require('./db.js');

async function uploadProductStyles(jsonObj) {
  let currentProductId;
  let resultsArr = [];
  for (let i = 0; i < jsonObj.length; i++) {
    const row = jsonObj[i];
    currentProductId = currentProductId || row.productId;
    if (currentProductId !== row.productId || i === jsonObj.length - 1) {
      // insert new entry
      let objToInsert = {
        product_id: currentProductId,
        results: resultsArr,
      };
      try {
        await models.ProductStyles.create(objToInsert);
      } catch {
        console.log(error);
        throw error;
      }
      resultsArr = [];
      currentProductId = row.productId;
    }
    let currentObj = {
      style_id: row.id,
      name: row.name,
      original_price: row.original_price,
      sale_price: row.sale_price,
      default: row.default_tyle,
      photos: [],
      skus: {},
    };
    resultsArr.push(currentObj);
  }
}

async function uploadData() {
  try {
    await db();
    console.time('product styles');
    const styleJson = await csv().fromFile('./sampleData/stylesSample.csv');
    console.log('uploading style data...');
    await uploadProductStyles(styleJson);
    console.log('styles uploaded!');
    console.timeEnd('product styles');
  } catch (error) {
    console.log(error);
  }
}

uploadData();
