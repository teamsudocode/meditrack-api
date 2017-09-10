'use strict';

const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;


const BillSchema = new Schema({
    chemist: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    patient: { type: Schema.Types.ObjectId, ref: 'Users' },
    totalPrice: Number,
    rebooked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});


BillSchema.plugin(idValidator);

module.exports = mongoose.model('Bills', BillSchema);
