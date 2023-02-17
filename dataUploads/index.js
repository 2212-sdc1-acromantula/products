const { uploadProductData } = require('./uploadProductData.js');
const { uploadProductPhotos } = require('./uploadProductPhotos.js');
const { uploadProductStylesData } = require('./uploadProductStylesData');
const { uploadSkusData } = require('./uploadSkusData');

const realData = {
  productData: 'data/product.csv',
  relatedData: 'data/related.csv',
  stylesData: 'data/styles.csv',
  photosData: 'data/photos.csv',
  skusData: 'data/skus.csv',
};

const sampleData = {
  productData: 'sampleData/productSample.csv',
  relatedData: 'sampleData/relatedSample.csv',
  stylesData: 'sampleData/stylesSample.csv',
  photosData: 'sampleData/photosSample.csv',
  skusData: 'sampleData/photosSample.csv',
};

async function uploadAllData(dataObj) {
  console.time('total time');
  console.log('starting upload...');
  await uploadProductData(dataObj.productData, dataObj.productData);
  await uploadProductStylesData(dataObj.stylesData);
  await uploadProductPhotos(dataObj.photosData);
  await uploadSkusData(dataObj.skusData);
  console.timeEnd('total time');
}

// SAMPLE DATA
// uploadAllData(sampleData);

// REAL DATA
uploadAllData(realData);
