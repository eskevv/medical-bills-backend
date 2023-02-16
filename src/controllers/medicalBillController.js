// ------------------------------------------------------------------------------------------------------------------------------------------------
// This controller class handles incoming HTTP requests and delegate the business logic to the service layer, 
// which in turn interacts with the database. This design helps keep the code organized and test components that have 
// clear and distinct responsibilities.
// ------------------------------------------------------------------------------------------------------------------------------------------------
const MedicalBillModel = require("../models/medicalBill");

class MedicalBillController {
  constructor(service) {
    this.service = service;
    this.model = new MedicalBillModel();
  }

  async getAllMedicalBills(req, res, next) {
    try {
      const medicalBills = await this.service.getAll();
      res.json(medicalBills);
    } catch (error) {
      next(error);
    }
  }

  async createMedicalBill(req, res, next) {
    try {
      // validate the request body against the MedicalBillModel schema
      const validatedBill = this.model.validate(req.body);

      // create a new medical bill using the validated data
      const insertedId = await this.service.create(validatedBill.value);

      res.json({ _id: insertedId });
      console.log(validatedBill); // console log what was inserted along with any errors and format differences
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MedicalBillController;
