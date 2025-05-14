/**
 * @file: Geolocation Service
 * @description: reusable location-based query logic, independent of any specific route
 */
const Pharmacy = require('../models/Pharmacy');

async function findNearByPharmacies(longitude, latitude, radiusKm=5){
    /**
     * Function that finds Pharmacies near a specific location, within 5km radius by default
     * Arguments:
     *      longitude: the east–west coordinate of the point.
     *      latitude:  the north-south cordinate of the point
     * 
     * Returns:
     *      The Pharmacies that are within the radius of a specific location
     */
    return Pharmacy.find({
        location: {
            $near: {
                $geometry: { type: 'Point', coordinates: [longitude, latitude] },
                $maxDistance: radiusKm * 1000,
            },
        },
        isActive: true,
    });
}

module.exports = { findNearByPharmacies };