var csv = require('csvtojson');
require('dotenv/config');
const {ProductStyles} = require('./model.js')
const db = require('./db.js')



async function findStylesByStyleId() {
  await db();
  const document = await ProductStyles.findOne(
    { 'results': { '$elemMatch': { 'style_id': 27 } } },
    { 'results.$': 1 }
  );
  console.log(document.results);
}

findStylesByStyleId();

async function uploadPhotos(jsonObj)

// async function uploadRelatedProducts(jsonObj) {
//   try {
//     for (let i = 0; i < jsonObj.length; i++) {
//       const row = jsonObj[i];
//       await models.ProductStyles.findOneAndUpdate(
//         { results.style_id: row.styleId },
//         { results[0].photos: {
//           url:
//         }
//         { upsert: true }
//       );
//       console.log('Data added to the database!');
//       // reset array and update product id
//       relatedArr = [];
//       current_product_id = row.current_product_id;
//       relatedArr.push(row.related_product_id);

//     }
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }

// async function uploadData() {
//   try {
//     await db();
//     const photosJson = await csv().fromFile('./sampleData/photosSample.csv');
//     await uploadProducts(photosJson);
//     console.log('Photos upload complete!')
//   } catch (error) {
//     console.log(error);
//   }
// }