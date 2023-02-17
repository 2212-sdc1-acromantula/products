// database.js

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const connectToDatabase = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/SDCsample', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to the database!');
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = connectToDatabase;
