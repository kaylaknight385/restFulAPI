require('dotenv').config();

const express = require('express');
const connectDB = require('./config/connection');
const app = express();
connectDB();

// middleware that tells express to parse incoming json data from requests
app.use(express.json());

// test for if the server is working
app.get('/', (req, res) => {
  res.json({ message: 'welcome to the commerce shop api' });
});

const PORT = process.env.PORT || 3000;

// start listening for requests on our port
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
