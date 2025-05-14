/**
 * @file: Definition of the Pharmacy schema
 * @description: A Pharmacy is owned by one User (role: 'pharmacy'). Stores
 * an embedded inventory array
 */

const mongoose = require('mongoose');

//The details of one inventory item in the pharmacy's inventory
const inventoryItemSchema = new mongoose.Schema({
    medicineName: { type: String, required: true},
    genericName: { type: String },
    price: { type: Number, required: true, min: 0},
    stock: { type: Number, required: true, min: 0},
    requiresPrescription: { type: Boolean, default: false}
});

//Definition of the Pharmacy schema
const pharmacySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    address: { type: String, required: true },
    operatingHours: { type: Object, default: {} },
    inventory: [inventoryItemSchema],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

/**
 * Create a geospatial index on the location field, using a 2dsphere index type, so that MongoDB can handle Earth‑like geospatial queries (distance, proximity)
 */
pharmacySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('pharmacy', pharmacySchema);