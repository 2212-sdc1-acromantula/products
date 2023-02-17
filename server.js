const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const cors = require('cors');
import axios from 'axios';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  res.send('Get route...');
  axios
    .get('localhost:27017/SDC')
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
