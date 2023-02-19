require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const db = mongoose.connection;
const cors = require('cors');
const axios = require('axios');
const { Products, ProductStyles } = require('./model');

db.on('error', (error) => console.error(error));
db.once('open', () =>
  console.log('Connected to database, waiting for input...')
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

// retrieves all products, two params, one for page and another for count
app.get('/products', async (req, res) => {
  console.log('products!');
  console.log(req.query);
  const page = req.query.page || 1;
  const count = req.query.count || 10;
  const products = [];

  const startingId = page * 10 - 9;
  console.log(count);
  console.log(startingId);
  for (let i = startingId; i <= Number(startingId) + Number(count) - 1; i++) {
    // console.log(i);
    const product = await Products.find({ id: i });
    products.push(product[0]);
  }
  res.send(products);
});

// retrieves one product that matches the id
app.get('/products/:product_id', async (req, res) => {
  const id = req.params.product_id;
  try {
    const product = await Products.find({ id: id });
    res.send(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
