const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    transactionType: { type: String, enum: ['rent', 'sell'], required: true },
    propertyType: { type: String, required: true },
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number }
        }
    },
    features: {
        area: { type: Number, required: true },
        bedrooms: { type: Number, required: true },
        bathrooms: { type: Number, required: true }
    },
    amenities: [{ type: String }],
    images: [{ type: String }],
    documents: {
        idCard: { type: String },
        titleDeedOrLease: { type: String }
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'sold', 'rented'], default: 'approved' },
}, {
    timestamps: true
});

module.exports = mongoose.model('Property', propertySchema);
