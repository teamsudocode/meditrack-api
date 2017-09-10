'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


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


module.exports = mongoose.model('Users', UserSchema);
