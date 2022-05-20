const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: {
        required: true,
        type: String
    },
    dob: {
        required: true,
        type: String
    },
    isSuspended: {
        required: true,
        type: Boolean
    }
})

module.exports = mongoose.model('User', schema)