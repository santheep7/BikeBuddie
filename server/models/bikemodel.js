const mongoose = require('mongoose');
const { Schema } = mongoose;

// Vehicle Schema definition
const vehicleSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true }, // Reference to User collection
    vehicleName: { type: String, required: true },
    model: { type: String, required: true },
    regNo: { type: String, required: true },
    place: { type: String, required: true },
    rcBookImage: { type: [String], required: true }, 
    insuranceImage: { type: [String], required: true }, // Same here for insurance
    licenseImage: { type: [String], required: true }, // Same for license image
    vehicleImage: { type: [String], required: true }, // Same for vehicle image
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Create a model based on the schema
const vehicleModel = mongoose.model('Vehicle', vehicleSchema);

module.exports = vehicleModel;
