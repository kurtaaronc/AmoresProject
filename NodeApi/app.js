const express = require('express');
const cors = require('cors');
const app = express();

const corsOptions = {
    origin: 'http://localhost:4200', // Replace with your allowed origin(s)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*',
  };
  
  // Use the cors middleware with your custom options
  app.use(cors(corsOptions));
const transactionRoutes = require('./api/routes/transactions.js')
app.use('/transactions', transactionRoutes)

module.exports = app;