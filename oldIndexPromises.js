var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const cors = require('cors');
var mongoose = require('mongoose');
var multer = require('multer');
var csv = require('csvtojson');
require('dotenv/config');
const models = require('./model.js')
var upload = multer({ dest: 'uploads/' });


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


function connectToDatabase() {
  return new Promise((resolve, reject) => {
    mongoose.connect('mongodb://localhost:27017/SDC', { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.set('strictQuery', false);
    const db = mongoose.connection;
    db.on('error', (error) => reject(error));
    db.once('open', () => {
      console.log('Connected to the database!');
      resolve();
    });
  });
}

function uploadProducts(jsonObj) {
  const products = jsonObj.map((item) => ({
    id: item.id,
    name: item.name,
    slogan: item.slogan,
    description: item.description,
    category: item.category,
    default_price: item.default_price,
    related_products: []
  }));
  return models.Product.insertMany(products)
    .then(() => console.log('Data added to the database!'))
    .catch((error) => console.log(error));
}

function uploadRelatedProducts(jsonObj) {
  let relatedArr = [];
  let current_product_id = 1;
  jsonObj.forEach(row => {
    if (row.current_product_id === current_product_id) {
      relatedArr.push(Number(row.related_product_id));
    } else {
      models.Product.findOneAndUpdate(
        { id: current_product_id },
        { related_products: relatedArr },
        { upsert: true }
      )
        .then(() => console.log('Data added to the database!'))
        .catch((error) => console.log(error));
      // reset array and update product id
      relatedArr = [];
      current_product_id = row.current_product_id;
      relatedArr.push(row.related_product_id);
    }
  });
}

// upload product data
connectToDatabase()
  .then(() => {
    csv()
      .fromFile('./sampleData/productSample.csv')
      .then((jsonObj) => {
        //upload products
        console.log(jsonObj)
        return uploadProducts(jsonObj);
      })
      .then(() => {
        //upload related products
        csv()
          .fromFile('./sampleData/relatedSample.csv')
          .then((jsonObj) => {
            console.log(jsonObj);
            uploadRelatedProducts(jsonObj);
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  });





// // upload product data
// connectToDatabase()
//   .then(() => {
//     csv()
//       .fromFile('./sampleData/productSample.csv')
//       .then((jsonObj) => {
//         //upload products
//         console.log(jsonObj)
//         uploadProducts(jsonObj)
//       })
//       .then(
//         csv()
//           .fromFile('./sampleData/relatedSample.csv')
//           .then((jsonObj) => {
//             console.log(jsonObj)
//             uploadRelatedProducts (jsonObj)
//           })
//       )
//       .catch((error) => console.log(error));
//   })

//       .then(
//         csv()
//           .fromFile('./sampleData/relatedSample.csv')
//           .then((jsonObj) => {
//             console.log(jsonObj)
//             uploadRelatedProducts(jsonObj)
//           })
//       )
//       .catch((error) => console.log(error));


// upload related products
// connectToDatabase()
//   .then(() => {
//     csv()
//       .fromFile('./sampleData/relatedSample.csv')
//       .then((jsonObj) => {
//         console.log(jsonObj)
//         let relatedArr = []
//         let current_product_id = 1
//         jsonObj.forEach(row => {
//           if (row.current_product_id === current_product_id) {
//             relatedArr.push(Number(row.related_product_id))
//           } else {
//             models.Product.findOneAndUpdate(
//               { id: current_product_id },
//               { related_products: relatedArr },
//               { upsert: true })
//               .then(() => console.log('Data added to the database!'))
//               .catch((error) => console.log(error));
//             relatedArr = []
//             current_product_id = row.current_product_id
//             relatedArr.push(row.related_product_id)
//           }
//         })
//       })
//       .catch((error) => console.log(error));
//   })




// example of batch size: models.Product.insertMany(products, { batchSize: 1000 })
