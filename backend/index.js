const express = require('express');
const User = require('./models/user');
const port = 8080;
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = process.env.SECRET_KEY;
const nodemailer = require('nodemailer');
require('dotenv').config();
app.use(cors());
app.use(express.json());
console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

mongoose.connect(`mongodb+srv://cafeteria:${process.env.MONGO_PASS}@cluster0.gwcqa.mongodb.net/user`)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));



  app.post('/signup', async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      // Hash the password before saving
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Save the new user with the hashed password
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
})
