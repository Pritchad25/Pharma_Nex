/**
 * @file: Business Logic for Pharmacy related routes
 */

const Pharmacy = require('../models/Pharmacy');
const { findNearByPharmacies } = require('../services/geoLocation');
const { isValidCoordinate } = require('../utils/validation');

//Register a Pharmacy
exports.registerPharmacy = async (req, res) => {
    try {
        const { name, licenseNumber, longitude, latitude, address } = req.body;
        const pharmacy = new Pharmacy ({
            userId: req.userData.userId,
            name,
            licenseNumber,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            },
            address
        })
        await pharmacy.save();
        res.status(201).json(pharmacy);
    }catch(err){
        res.status(500).json({ message: "Error registering pharmacy", error: err.message });
    }
};

//List all pharmacies
exports.listPharmacies = async (req, res) => {
    const pharmacies = await Pharmacy.find({ isActive: true });
    if (!pharmacies || pharmacies.length === 0) {
        return res.status(404).json({ message: "No pharmacies found" });
    }
    res.json(pharmacies);
};

//Find Near-By Pharmacies
exports.nearByPharmacies = async (req, res) => {
    const { longitude, latitude, radius } = req.query;
    //If EITHER longitude OR latitude are missing, throw an error
    if (!isValidCoordinate(Number(longitude)) || !isValidCoordinate(Number(latitude))) {
        return res.status(400).json({ message: "Invalid or missing coordinates"});
    }

    const nearByPharmacies = await findNearByPharmacies (Number(longitude), Number(latitude), Number(radius) || 5); //Default radius is 5 km if not provided
    if (!nearByPharmacies || nearByPharmacies.length === 0) {
        return res.status(404).json({ message: "No nearby pharmacies found" });
    }
    res.json(nearByPharmacies);
};

//Get Pharmacy By Id
exports.getPharmacyById = async (req, res) => {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid pharmacy ID format' });
    }
    const pharmacy = await Pharmacy.findById(req.params.id).populate('userId', 'name surName email');
    if (!pharmacy) {
        return res.status(404).json({ message: 'Pharmacy not found' });
    }
    res.json(pharmacy);
};

//Update pharmacy
exports.updatePharmacy = async (req, res) => {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid pharmacy ID format' });
    }
    const pharmacy = await Pharmacy.findById(req.params.id);
    //Check if the pharmacy exists
    if (!pharmacy) {
        return res.status(404).json({ message: 'Pharmacy not found'});
    }
    //check if the user is the owner of the pharmacy
    if (pharmacy.userId.toString() !== req.userData.userId) {
        return res.status(403).json({ message: 'You are not authorized to update this pharmacy'});
    }
    //Update the pharmacy details, by copying the request body to the pharmacy object
    Object.assign(pharmacy, req.body);
    await pharmacy.save();
    res.json(pharmacy);
};