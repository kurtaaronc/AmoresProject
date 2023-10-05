const { MongoClient } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3100;
const mongoURI = "mongodb+srv://kurtaaronc:Vvzv00PrxyseZCdb@cluster0.oyoofhy.mongodb.net/?retryWrites=true&w=majority"; // Replace with your MongoDB connection URI
const dbName = "LoanTransactions"; // Replace with your database name
const collectionName = 'LoanTransactions'; // Replace with your collection name

app.use(bodyParser.json());

// Define a POST route to handle incoming data and store it in MongoDB
app.post('/api/posts', async (req, res) => {
  try {
    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const transaction = {
      Date: req.body.Date,
      Name: req.body.Name,
      LoanAmount: req.body.LoanAmount,
      Interest: req.body.Interest,
      Terms: req.body.Terms,
      ReleaseAmount: req.body.ReleaseAmount,
      Profit: req.body.Profit,
      ExpectedPaymentDate: req.body.ExpectedPaymentDate,
      ExpectedPayment: req.body.ExpectedPayment,
      TransactionComplete: req.body.TransactionComplete
    };
    
    console.log(transaction)
    // Insert a document into the LoanTransactions collection
    const result = await collection.insertOne(transaction);
    const transactionId = result.insertedId;

    let counter = 1;
    let remainingBalance = 0;
    let newExpectedPaymentDate = req.body.ExpectedPaymentDate;
    let daysToAdd = 0;

    console.log(newExpectedPaymentDate)

    const collectionPayment = db.collection("Payments");

    while (counter <= req.body.Terms * 2) {
      remainingBalance = req.body.LoanAmount - req.body.ExpectedPayment * counter;
      newExpectedPaymentDate = req.body.ExpectedPaymentDate;

      if (counter > 1) {
        daysToAdd = 15 * (counter - 1);
        const dateObj = new Date(newExpectedPaymentDate);
        dateObj.setDate(dateObj.getDate() + daysToAdd);
        newExpectedPaymentDate = dateObj.toISOString().slice(0, 10);
      }

      const payment = {
        Name: req.body.Name,
        PaymentDate: newExpectedPaymentDate,
        Payment: req.body.ExpectedPayment,
        TransactionId: transactionId,
        RemainingBalance: remainingBalance,
      };

      // Insert a document into the Payments collection
      await collectionPayment.insertOne(payment);

      counter++;
    }

    res.status(201).json({ message: 'Post created successfully', postId: transactionId });
    client.close();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
