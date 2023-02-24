const { uploadProductData } = require('./uploadProductData.js');
const { uploadProductPhotos } = require('./uploadProductPhotos.js');
const { uploadProductFeatures } = require('./uploadFeaturesData');
const { uploadProductStylesData } = require('./uploadProductStylesData');
const { uploadSkusData } = require('./uploadSkusData');

const realData = {
  productData: 'data/product.csv',
  relatedData: 'data/related.csv',
  featuresData: 'data/features.csv',
  stylesData: 'data/styles.csv',
  photosData: 'data/photos.csv',
  skusData: 'data/skus.csv',
};

const sampleData = {
  productData: 'sampleData/productSample.csv',
  relatedData: 'sampleData/relatedSample.csv',
  featuresData: 'sampleData/featuresSample.csv',
  stylesData: 'sampleData/stylesSample.csv',
  photosData: 'sampleData/photosSample.csv',
  skusData: 'sampleData/skusSample.csv',
};

async function uploadAllData(dataObj) {
  console.time('total time');
  console.log('starting upload...');
  // await uploadProductData(dataObj.productData, dataObj.relatedData);
  // await uploadProductFeatures(dataObj.featuresData);
  // await uploadProductStylesData(dataObj.stylesData);
  await uploadSkusData(dataObj.skusData);
  await uploadProductPhotos(dataObj.photosData);
  console.timeEnd('total time');
}

// SAMPLE DATA
// uploadAllData(sampleData);

// REAL DATA
uploadAllData(realData);
