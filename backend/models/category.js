const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    Name: {
            type: String, 
            required: true, 
            unique: true
            },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;