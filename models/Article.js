const mongoose = require('mongoose');
const dataSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    body: {
        required: true,
        type: String
    },
    comments: [
        {
            content:{
                required: true,
                type: String
            },
            username: {
                required: true,
                type: String
            },
        }
    ]
},
{
    timestamps: true,
})

module.exports = mongoose.model('Article', dataSchema)