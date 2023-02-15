const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// # simple medical bill GET / POST endpoints #

let bills = [ // <-- local data storage no database solution (easier to test)
  { patientName: 'John Doe', patientAddress: '123 Main St', hospitalName: 'General Hospital', dateOfService: '2022-02-15', billAmount: 1000 },
  { patientName: 'Jane Smith', patientAddress: '456 Elm St', hospitalName: 'St. Mary\'s Hospital', dateOfService: '2022-02-16', billAmount: 2000 }
]; // usually i'd go with postgress, mongo, or microsoft sql and include my connection string in a .env file

app.use(express.json()); // parsing method to extract json from requests

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

// listen from default port 3000 for http requests using express' server api
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// -------------------------------------------------------------------------------------------------------------------
// * Testing Endpoints (without using other gui clients like Postman) * 
// all data remains valid in local storage as long as the connection is up (hence the app is running)
// -------------------------------------------------------------------------------------------------------------------
// curl http://localhost:3000/items
// curl -X POST -H 'Content-Type: application/json' -d '{"patientName": "John Smith", "patientAddress": "123 Main St", "hospitalName": "General Hospital", "dateOfService": "2022-02-15", "billAmount": 1000}' http://localhost:3000/items
// -------------------------------------------------------------------------------------------------------------------

// ==================================================================================================
// * A database post request would look something like this in mongo (condensed to one function) *
// * The client object would have been created but best practice is to keep a connection pool for performance *
// ===================================================================================================
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
// ===================================================================================================