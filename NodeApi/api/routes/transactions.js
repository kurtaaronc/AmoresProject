const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId; 
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const mongoURI = "mongodb+srv://kurtaaronc:wJxfmrDzPLMtDlTT@serverlessinstance.sxi2uf9.mongodb.net/?retryWrites=true&w=majority";
//const mongoURI = "mongodb+srv://kurtaaronc:Vvzv00PrxyseZCdb@cluster0.oyoofhy.mongodb.net/?retryWrites=true&w=majority"; // Replace with your MongoDB connection URI
const dbName = "LoanTransactions"; // Replace with your database name
router.use(express.json());
router.use(bodyParser.json());

//GetAllLoans
router.get('/', async( req, res) =>{
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('LoanTransactions');
    const documents = await collection.distinct('Name', { TransactionComplete: { $ne: "Yes" } });
    res.status(200).json(documents);
    client.close();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//getMonthlyTransactions
router.get('/AllMonthly', async( req, res) =>{
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    const db = client.db(dbName);
    const paymentsCollection = db.collection('Payments');
    const loansCollection = db.collection('LoanTransactions');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const loans = await loansCollection.find({
      // Query for documents where the "Date" field's year and month match the current year and month
      Date: {
        $regex: `^${currentYear}-${currentMonth.toString().padStart(2, '0')}`
      },
      TransactionComplete: { $ne: "Yes" }
    }).toArray();
    const totalLoans = await loansCollection.find({
      // Query for documents where the "Date" field's year matches the current year
      Date: {
        $regex: `^${currentYear}`
      },
      TransactionComplete: { $ne: "Yes" }
    }).toArray();
    const payments = await paymentsCollection.find({
      // Query for documents where the "Date" field's year and month match the current year and month
      PaymentDate: {
        $regex: `^${currentYear}-${currentMonth.toString().padStart(2, '0')}`
      },
      TransactionComplete: { $ne: "Yes" }
    }).toArray();
    loans.sort((a, b) => {
      const nameA = a.Name.toLowerCase();
      const nameB = b.Name.toLowerCase();
    
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    payments.sort((a, b) => {
      const nameA = a.Name.toLowerCase();
      const nameB = b.Name.toLowerCase();
    
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    res.json({ payments, loans, totalLoans });
    client.close();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//getActiveTransactions
router.get('/:transactionName', async( req, res) =>{
  const id = req.params.transactionName;
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    const db = client.db(dbName);
    const paymentsCollection = db.collection('Payments');
    const loansCollection = db.collection('LoanTransactions');

    // First query to get data from Payments collection
    const payments = await paymentsCollection.find({ Name: id, TransactionComplete: null }).toArray();
    const loans = await loansCollection.find({ Name: id, TransactionComplete: null }).toArray();
    payments.sort((a, b) => new Date(a.PaymentDate) - new Date(b.PaymentDate));
    res.json({ payments, loans });
    client.close();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//complete Loan
router.put('/completeTransaction', async (req, res) => {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    const db = client.db(dbName);
    const paymentsCollection = db.collection('Payments');
    const loansCollection = db.collection('LoanTransactions');

    const filterForPayments = { TransactionId: new ObjectId(req.body.Id) };
    const filterForLoans = { _id: new ObjectId(req.body.Id) };
    const update = {
      $set: {
        TransactionComplete: "Yes"
      }
    }
    const paymentUpdateResult = await paymentsCollection.updateMany(filterForPayments, update);
    const loanUpdateResult = await loansCollection.updateOne(filterForLoans, update);

    if (paymentUpdateResult.modifiedCount > 0 && loanUpdateResult.modifiedCount === 1) {
      res.json({ status: "Success"})
      client.close();
    } else {
      res.status(404).json({ message: 'No documents found for update' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//make payment
router.put('/createPayment', async (req, res) => {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    const db = client.db(dbName);
    const paymentsCollection = db.collection('Payments');
    const { Id, ActualDateOfPayment, ActualPayment } = req.body;
    const filterForPayments = { _id: new ObjectId(Id) };
    const update = {
      $set: {
        ActualDateOfPayment,
        ActualPaymentMade: ActualPayment
      }
    }

    // Use updateMany to update multiple documents in paymentsCollection
    const paymentUpdateResult = await paymentsCollection.updateOne(filterForPayments, update);

    if (paymentUpdateResult.modifiedCount > 0) {
      res.json({ status: "Success"})
      client.close();
    } else {
      res.status(404).json({ message: 'No documents found for update' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//updateDateOfPayment
router.put('/updateDateOfPayment', async (req, res) => {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    const db = client.db(dbName);
    const paymentsCollection = db.collection('Payments');
    const { Id, ActualDateOfPayment } = req.body;
    const filterForPayments = { _id: new ObjectId(Id) };
    const update = {
      $set: {
        PaymentDate: ActualDateOfPayment 
      }
    }

    // Use updateMany to update multiple documents in paymentsCollection
    const paymentUpdateResult = await paymentsCollection.updateOne(filterForPayments, update);

    if (paymentUpdateResult.modifiedCount > 0) {
      res.json({ status: "Success"})
      client.close();
    } else {
      res.status(404).json({ message: 'No documents found for update' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//makeNewLoan
router.post('/', async (req, res) => {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    const session = client.startSession();
    session.startTransaction();
    const db = client.db(dbName);
    const paymentsCollection = db.collection('Payments');
    const loansCollection = db.collection('LoanTransactions');

    const transaction = {
      Date: req.body.Date,
      Name: req.body.Name,
      LoanAmount: req.body.LoanAmount,
      Interest: req.body.Interest,
      Terms: req.body.Terms,
      ReleaseAmount: req.body.ReleaseAmount,
      Profit: req.body.Profit,
      ExpectedPaymentDate: req.body.ExpectedDateOfPayment,
      ExpectedPayment: Math.ceil(req.body.ExpectedPayment),
      TransactionComplete: req.body.TransactionComplete
    };
    
    // Insert a document into the LoanTransactions collection
    const result = await loansCollection.insertOne(transaction);
    const transactionId = result.insertedId;

    let counter = 1;
    let remainingBalance = 0;
    let newExpectedPaymentDate = req.body.ExpectedDateOfPayment;
    let daysToAdd = 0;

    while (counter <= req.body.Terms * 2) {
      remainingBalance = Math.ceil(req.body.LoanAmount - req.body.ExpectedPayment * counter);
      newExpectedPaymentDate = req.body.ExpectedDateOfPayment;

      if (counter > 1) {
        daysToAdd = 15 * (counter - 1);
        const dateObj = new Date(newExpectedPaymentDate);
        dateObj.setDate(dateObj.getDate() + daysToAdd);
        newExpectedPaymentDate = dateObj.toISOString().slice(0, 10);
        
        // Check if newExpectedPaymentDate is near 15 or 30, and round it up if needed
        const dateDay = dateObj.getDate();
        const dateMonth = dateObj.getMonth(); // Get the month as an index (0 for January, 1 for February, etc.)
        
        if (dateMonth === 1) { // February
          if (dateDay >= 1 && dateDay <= 15) {
            dateObj.setDate(15);
          } else {
            if (isLeapYear(dateObj.getFullYear())) {
              dateObj.setDate(29);
            } else {
              dateObj.setDate(28);
            }
          }
        } else if (dateDay >= 1 && dateDay <= 15) {
          dateObj.setDate(15);
        } else if (dateDay >= 16 && dateDay <= 30) {
          dateObj.setDate(30);
        } else if (dateDay >= 16 && dateDay <= 28) {
          dateObj.setDate(28);
        }
        
        newExpectedPaymentDate = dateObj.toISOString().slice(0, 10);
      }
      
      const payment = {
        TransactionId: transactionId,
        Name: req.body.Name,
        PaymentDate: newExpectedPaymentDate,
        Payment: Math.ceil(req.body.ExpectedPayment),
        ActualDateOfPayment: null,
        ActualPaymentMade: null,
        RemainingBalance: remainingBalance,
        TransactionComplete: null
      };

      await paymentsCollection.insertOne(payment);

      counter++;
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'Post created successfully', postId: transactionId });
    client.close();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

module.exports = router;