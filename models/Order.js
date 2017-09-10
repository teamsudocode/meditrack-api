'use strict';

const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;


const OrderSchema = new Schema({
    medicine: { type: Schema.Types.ObjectId, ref: 'Medicines', required: true },
    bill: { type: Schema.Types.ObjectId, ref: 'Bills', required: true },
    dosage: { type: Number, min: 1, required: true },
    quantity: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});


OrderSchema.plugin(idValidator);

module.exports = mongoose.model('Orders', OrderSchema);
