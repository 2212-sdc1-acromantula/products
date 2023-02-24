var mongoose = require('mongoose');
var csv = require('csvtojson');
require('dotenv/config');
const { ProductStyles } = require('../model.js');
const db = require('../db.js');

// async function uploadPhotos(jsonObj) {
//   for (let i = 0; i < jsonObj.length; i++) {
//     const row = jsonObj[i];
//     const thumbURL = row.thumbnail_url;
//     const cleanedThumbnailURL = thumbURL.substring(
//       0,
//       thumbURL.indexOf('q=80') + 'q=80'.length
//     );
//     let photoObj = {
//       thumbnail_url: cleanedThumbnailURL,
//       url: row.url,
//     };
//     try {
//       await ProductStyles.findOneAndUpdate(
//         { 'results.style_id': row.styleId },
//         { $push: { 'results.$.photos': photoObj } }
//       );
//     } catch (error) {
//       console.log(error);
//       throw error;
//     }
//   }
// }

async function uploadPhotos(jsonObj) {
  for (let i = 0; i < jsonObj.length; i++) {
    const row = jsonObj[i];
    try {
      await ProductStyles.findOneAndUpdate(
        { 'results.style_id': row.styleId },
        {
          $push: {
            'results.$.photos': {
              thumbnail_url: row.thumbnail_url,
              url: row.url,
            },
          },
        }
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

// real data
async function uploadProductPhotos(csv1) {
  try {
    await db();
    const photosJson = await csv().fromFile(csv1);
    console.time('style photos');
    console.log('uploading photos...');
    await uploadPhotos(photosJson);
    console.timeEnd('style photos');
    console.log('Photos upload complete!');
  } catch (error) {
    console.log(error);
  }
}

module.exports = { uploadProductPhotos };
