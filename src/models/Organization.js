const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true,
        default: 'USD'
    },
    settings: {
        fiscalYearStart: { type: String, default: '01-01' },
        timezone: { type: String, default: 'UTC' },
        taxLabels: { type: String, default: 'Tax' }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Organization', organizationSchema);
