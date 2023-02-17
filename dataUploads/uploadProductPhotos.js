var mongoose = require('mongoose');
var csv = require('csvtojson');
require('dotenv/config');
const { ProductStyles } = require('../model.js');
const db = require('../db.js');

async function uploadPhotos(jsonObj) {
  for (let i = 0; i < jsonObj.length; i++) {
    const row = jsonObj[i];
    let photoObj = {
      thumbnail_url: row.thumbnail_url,
      url: row.url,
    };
    try {
      await ProductStyles.findOneAndUpdate(
        { 'results.style_id': row.styleId },
        { $push: { 'results.$.photos': photoObj } }
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

// real data
async function uploadProductPhotos() {
  try {
    await db();
    const photosJson = await csv().fromFile('data/photosSample.csv');
    console.time('style photos');
    console.log('uploading photos...');
    await uploadPhotos(photosJson);
    console.timeEnd('style photos');
    console.log('Photos upload complete!');
  } catch (error) {
    console.log(error);
  }
}

// sample data
async function uploadSampleProductPhotos() {
  try {
    await db();
    const photosJson = await csv().fromFile('sampleData/photosSample.csv');
    console.time('style photos');
    console.log('uploading photos...');
    await uploadPhotos(photosJson);
    console.timeEnd('style photos');
    console.log('Photos upload complete!');
  } catch (error) {
    console.log(error);
  }
}

module.exports = { uploadProductPhotos, uploadSampleProductPhotos };
