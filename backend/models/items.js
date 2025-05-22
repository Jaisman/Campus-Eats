const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    Name:{
            type: String, 
            required: true, 
            unique: true
        },
    Price:{
            type: String, 
            required: true,
        },
    Description:{
            type: String, 
            required: true,
        },
    Image:{
        type:String,
        required:true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;