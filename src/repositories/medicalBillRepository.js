// ------------------------------------------------------------------------------------------------------------------------------------------------
// Database utility class that acts as a main data repository in the application context
// This Repository class like similar MedicalBillRepository classes provides several CRUD operations
// for the medical documents, or any objects stored inside the database
// This class has opportunity for abstraction with an interface or other abstract class (dependency inversion)
// ------------------------------------------------------------------------------------------------------------------------------------------------

const { MongoClient, ObjectId } = require('mongodb');

class MedicalBillRepository {
  constructor(url, dbName) {
    this.url = url;
    this.dbName = dbName;
  }

  async connect() {
    if (this.db) {
      return this.db;
    }

    const client = await MongoClient.connect(this.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.db = client.db(this.dbName);
    return this.db;
  }

  async getAll() {
    const db = await this.connect();
    return db.collection('medicalBills').find().toArray();
  }

  async create(medicalBill) {
    const db = await this.connect();
    const result = await db.collection('medicalBills').insertOne(medicalBill);
    return result.insertedId;
  }

  async getById(id) {
    const db = await this.connect();
    // mongodb uses ObjectIds internally saving us from having to generate our own unique ids e.g. w/ uuid
    return db.collection('medicalBills').findOne({ _id: new ObjectId(id) });
  }
}

module.exports = MedicalBillRepository;
