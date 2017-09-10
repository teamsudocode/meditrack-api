'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MedicineSchema = new Schema({
    name: { type: String, required: true, unique: true, lowercase: true, trim: true },
    rate: { type: Number, required: true },
    type: {
        type: String,
        enum: ['tablet', 'capsule', 'syrup', 'injection'],
        required: true
    }
});


module.exports = mongoose.model('Medicines', MedicineSchema);
