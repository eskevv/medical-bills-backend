const express = require('express');
const MedicalBillController = require('./src/controllers/medicalBillController');
const MedicalBillService = require('./src/services/medicalBillService');
const DatabaseMedicalBillRepository = require('./src/repositories/medicalBillRepository');
const MemoryMedicalBillRepository = require('./src/repositories/memoryMedicalBillRepository');
const PORT = process.env.PORT || 3000;
const app = express();

const solution = 1;
if (solution === 1) { solution_one(); }
if (solution === 2) { solution_two(); }

// MAIN SOLUTION
// --------------------------------------------------------------------------------------------------------------------------------------------------
function retrieve_database() {
  if (process.env.DB_URL) { // no variables are set in this example
    // If the environment variable DB_URL is set, use a real database instead
    // this database uses MongoDB, but can also be Postgress (what I'm familiar with) / Microsoft SQL, etc.
    return new DatabaseMedicalBillRepository(process.env.DB_URL);
  }
  return new MemoryMedicalBillRepository();
}

async function solution_one() {
  // dependency inversion to get the correct data respository
  const medicalBillRepository = retrieve_database();

  // Create a new medical bill service with the appropriate repository 
  // ...handles abstract operations and acts as intermediary 
  const medicalBillService = new MedicalBillService(medicalBillRepository);

  // Create a new medical bill controller with the service
  // ...receives the initial request from the client
  const medicalBillController = new MedicalBillController(medicalBillService);

  // parsing method to extract json from requests
  app.use(express.json());

  // Define routes - these endpoint operations now look a lot simpler (compared to below solution)
  // ...you can be sure they do what the method says in one line of code
  // ...i also choose not to bind the method to the controller instance ('this') here and use the arguements instead
  app.get('/items', (req, res, next) => medicalBillController.getAllMedicalBills(req, res, next));
  app.post('/items', (req, res, next) => medicalBillController.createMedicalBill(req, res, next));

  // listen from default port 3000 for http requests using express' server api
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

// ALTERNATIVE SIMPLE SOLUTION
// --------------------------------------------------------------------------------------------------------------------------------------------------
async function solution_two() {
  // # simple medical bill GET / POST endpoints solution #
  // no model class / no database
  let bills = [ // <-- local data storage no database solution (easier to test)
    { patientName: 'John Doe', patientAddress: '123 Main St', hospitalName: 'General Hospital', dateOfService: '2022-02-15', billAmount: 1000 },
    { patientName: 'Jane Smith', patientAddress: '456 Elm St', hospitalName: 'St. Mary\'s Hospital', dateOfService: '2022-02-16', billAmount: 2000 }
  ]; // usually i'd go with postgress, mongo, or microsoft sql and include my connection string in a .env file

  app.get('/items', (req, res) => {
    // read from where billing data is located and retrieve all documents
    // this solution does not assume a unique id to link for ownership of a document
    // the req parameter can be used for security or access permissions but res is all we need here
    res.json(bills);
  });

  app.post('/items', (req, res) => {
    // the body of the requests will contain the object sent from the client, we can decide after how to handle it
    // this post request will immediately save the bill in ram
    const { patientName, patientAddress, hospitalName, dateOfService, billAmount } = req.body;
    const bill = { patientName, patientAddress, hospitalName, dateOfService, billAmount };
    console.log(req.body);
    bills.push(bill);
    res.status(201).json(bill); // ok-created status
  });
}

// --------------------------------------------------------------------------------------------------------------------------------------------------
// >> BELOW IS SPECULATION AND NOTES FOR TESTING ENDPOINTS AS WELL AS CLIENT SIDE CALLS TO API <<
// -------------------------------------------------------------------------------------------------------------------
// ** Testing Endpoints (without using other gui clients like Postman)
// ** all data remains valid in local storage as long as the connection is up (app is running)
// ** another way to validate the data is using the error value from a model schema and logging it to the console
// -------------------------------------------------------------------------------------------------------------------
// curl http://localhost:3000/items
// curl -X POST -H 'Content-Type: application/json' -d '{"patientName": "John Smith", "patientAddress": "123 Main St", "hospitalName":
//    "General Hospital", "dateOfService": "2022-02-15", "billAmount": 1000}' http://localhost:3000/items

// -------------------------------------------------------------------------------------------------------------------
// ** solution one (bad) ->
// ** A database post request would look something like this in mongo (condensed into one function)
// ** The client object would have been created but best practice is to keep a connection pool for better performance
// -------------------------------------------------------------------------------------------------------------------
// app.post("/items", async (req, res) => {
//   const { patientName, patientAddress, hospitalName, dateOfService, billAmount } = req.body;
//   const bill = { patientName, patientAddress, hospitalName, dateOfService, billAmount };
//   try {
//     await client.connect();
//     const db = client.db("truffle");
//     const bill = await db.collection("bills").insertOne(bill);
//     res.status(201).json(bill);
//   } catch (error) {
//     console.error(error);
//   } finally {
//     client.close();
//   }
// });

// ------------------------------------------------------------------------------------------------------------------
// ** using dependency injection with maintainability in mind
// ------------------------------------------------------------------------------------------------------------------
//// Using an in-memory database
// let medicalBillRepository = new MemoryMedicalBillRepository();
// const medicalBillService = new MedicalBillService(medicalBillRepository);
// const medicalBillController = new MedicalBillController(medicalBillService);
// // ...

// // Using MongoDB (this code would be paired with a real database solution and does not work on it's own)
// const { MongoClient } = require('mongodb');
// const mongoUrl = 'mongodb://localhost:27017';
// const dbName = 'mydb';
// const collectionName = 'medicalBills';
// const mongoClient = new MongoClient(mongoUrl, { useUnifiedTopology: true });
//
// await mongoClient.connect();
// const collection = mongoClient.db(dbName).collection(collectionName);
// let medicalBillRepository = new DatabaseMedicalBillRepository(collection);
// const medicalBillService = new MedicalBillService(medicalBillRepository);
// const medicalBillController = new MedicalBillController(medicalBillService);
//  // ...
//
// ===================================================================================================================