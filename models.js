'use strict';

const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;


/* ------------------------------------------------------------------------- */

const BillSchema = new Schema({
    chemist: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    patient: { type: Schema.Types.ObjectId, ref: 'Users' },
    totalPrice: Number,
    rebooked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

BillSchema.plugin(idValidator);

const billModel = mongoose.model('Bills', BillSchema);


/* ------------------------------------------------------------------------- */

const MedicineSchema = new Schema({
    name: { type: String, required: true, unique: true, lowercase: true, trim: true },
    rate: { type: Number, required: true },
    type: {
        type: String,
        enum: ['tablet', 'capsule', 'syrup', 'injection'],
        required: true
    }
});

const medicineModel = mongoose.model('Medicines', MedicineSchema);


/* ------------------------------------------------------------------------- */

const OrderSchema = new Schema({
    medicine: { type: Schema.Types.ObjectId, ref: 'Medicines', required: true },
    bill: { type: Schema.Types.ObjectId, ref: 'Bills', required: true },
    dosage: { type: Number, min: 1, required: true },
    quantity: { type: Number, required: true },
    available: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

OrderSchema.plugin(idValidator);

const orderModel = mongoose.model('Orders', OrderSchema);


/* ------------------------------------------------------------------------- */

const UserSchema = new Schema({
    username : { type: String, unique: true, trim: true, required: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    address: { type: String, trim: true},
    role: {
        type: String,
        enum: ['patient', 'chemist', 'admin'],
        required: true
    }
});

const userSchema = mongoose.model('Users', UserSchema);

/* ------------------------------------------------------------------------- */
