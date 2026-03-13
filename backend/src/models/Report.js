const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);
