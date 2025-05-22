const express = require('express');
const User = require('./models/user');
const Category = require('./models/category');
const Item = require('./models/items');
const port = 8080;
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
const nodemailer = require('nodemailer');
app.use(cors());
app.use(express.json());
console.log(SECRET_KEY);
// console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));



  app.post('/signup', async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role
      });
      
      await newUser.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id, email: user.email, role:user.role }, SECRET_KEY, { expiresIn: '1h' });
    
    res.json({ 
      message: 'Logged in successfully',
      token, 
      user: { id: user._id, email: user.email, role:user.role , username: user.username} 
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  } 
});



app.post('/send-order-email',async(req,res)=>{
  try{
    const {orderId, email} = req.body;
    if(!orderId || !email){
      return res.status(400).json({message: 'Invalid request'});
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Order is Ready!',
      text: `Hello,
      Your order (#${orderId}) has been prepared and is ready for pickup. Kindly come to receive your food.

      Thank you for choosing our service!

      Best regards,
      The Restaurant Team`
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    res.status(200).json({ message: 'Email sent successfully' });
  }
  catch(error){
    console.log(error);
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const { Name } = req.body;
    console.log(Name);
    if (!Name || Name.trim() === '') {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const existing = await Category.findOne({ Name });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const newCategory = new Category({ Name });
    await newCategory.save();

    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/fetch-users',async(req,res)=>{
  try{
    const users = await User.find();
    res.status(200).json(users);
  }
  catch(error){
    console.log(error);
  }
});

app.get('/fetch-categories',async(req,res)=>{
  try {
    const categories = await Category.find();
    console.log(categories);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const { Name, Price, Description, Image, category } = req.body;

    if (!Name || !Price || !Description || !Image || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if item with same Name exists
    const existingItem = await Item.findOne({ Name });
    if (existingItem) {
      return res.status(409).json({ message: 'Item with this Name already exists' });
    }

    const newItem = new Item({ Name, Price, Description, Image, category });
    await newItem.save();

    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/categories/:id/items', async (req, res) => {
  try {
    const items = await Item.find({ category: req.params.id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.post('/add/item', async (req, res) => {
  try {
    const { Name, Price, Description, Image, category } = req.body;

    const newItem = new Item({ Name, Price, Description, Image, category });
    await newItem.save();

    res.status(201).json({ message: 'Item created successfully', item: newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

app.delete('/categories/:categoryId/items/:itemId', async (req, res) => {
  const { categoryId, itemId } = req.params;
  try {
    // Find item with matching itemId and categoryId
    const deletedItem = await Item.findOneAndDelete({ _id: itemId, category: categoryId });
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found in this category' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

app.put('/items/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const { Name, Price, Description, Image } = req.body;

  try {
    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { Name, Price, Description, Image },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/category/delete/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  try {
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});