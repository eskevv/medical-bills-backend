const Joi = require('joi');

class MedicalBill {
  constructor(patientName, patientAddress, hospitalName, dateOfService, billAmount) {
    this.patientName = patientName;
    this.patientAddress = patientAddress;
    this.hospitalName = hospitalName;
    this.dateOfService = dateOfService;
    this.billAmount = billAmount;
  }

  // validation method uses Joi to create a schema and makes sure the correct object is produced 
  validate(medicalBill) {
    const schema = Joi.object({
      date: Joi.date().required(),
      description: Joi.string().required(),
      amount: Joi.number().min(0).required()
    });

    return schema.validate(medicalBill);
  }
}

module.exports = MedicalBill;
