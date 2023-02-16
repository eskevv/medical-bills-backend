// Simple modular alternative to solution 2
// ...all data is kept in ram and therefore only valid while the application is running 

class MemoryMedicalBillRepository {
  constructor() {
    this.medicalBills = [];
  }

  async getAll() {
    return this.medicalBills;
  }

  async create(medicalBill) {
    this.medicalBills.push(medicalBill);
    return medicalBill;
  }
}

module.exports = MemoryMedicalBillRepository;
