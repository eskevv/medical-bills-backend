// ------------------------------------------------------------------------------------------------------------------------------------------------
// The MedicalBillService class uses the MedicalBillRepository class to perform CRUD operations on the medicalBills collection in the database.
// --with this service class, you can now separate the business logic from the database logic, making it easier to test and modify this application.
// This leads into creating modular and scalable REST APIs for various services using container data
// ------------------------------------------------------------------------------------------------------------------------------------------------

class MedicalBillService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAll() {
    const medicalBills = await this.repository.getAll();
    return medicalBills;
  }

  async create(medicalBill) {
    const insertedId = await this.repository.create(medicalBill);
    return insertedId;
  }

  async getById(id) {
    const medicalBill = await this.repository.getById(id);
    return medicalBill;
  }
}

module.exports = MedicalBillService;
