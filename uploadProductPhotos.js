var mongoose = require('mongoose');
var csv = require('csvtojson');
require('dotenv/config');
const {ProductStyles} = require('./model.js')
const db = require('./db.js')

async function uploadPhotos(jsonObj) {
  for (let i = 0; i < jsonObj.length; i++) {
    const row = jsonObj[i];
    let photoObj = {
      thumbnail_url: row.thumbnail_url,
      url: row.url
    }
    console.log(`Querying for style ID ${row.styleId}`);
    try {
      await ProductStyles.findOneAndUpdate(
        { 'results.style_id': row.styleId },
        // { 'results': { '$elemMatch': { 'style_id': row.styleId } } },
        { $push: { 'results.$.photos' : photoObj }}
        // { $addToSet: { photos : photoObj }}
      )
      console.log('pushed!')
    } catch (error) {
        console.log(error);
        throw error;
    }
  }
}

async function uploadData() {
  try {
    await db();
    const photosJson = await csv().fromFile('./sampleData/photosSample.csv');
    await uploadPhotos(photosJson);
    console.log('Photos upload complete!')
  } catch (error) {
    console.log(error);
  }
}

uploadData()




// async function findStylesByStyleId() {
//   await db();
//   const document = await ProductStyles.findOne(
//     { 'results': { '$elemMatch': { 'style_id': 27 } } },
//     { 'results.$': 1 }
//   );
//   console.log(document.results);
// }

// findStylesByStyleId();