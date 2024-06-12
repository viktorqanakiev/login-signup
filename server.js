require('dotenv').config(); // Load environment variables at the top
console.log('JWT_SECRET:', process.env.JWT_SECRET); // Debug logging
const express = require('express');
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
// Dummy user storage
let users = [];

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Signup route
app.post('/api/signup', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('password_confirmation').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    })
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Check if the user already exists
    const userExists = users.some(user => user.email === email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
  
    // Save the new user
    const newUser = { name, email, password: hashedPassword };
    users.push(newUser);
    const token = jwt.sign({ name, email }, process.env.JWT_SECRET);

    res.status(201).json({ user: { name, email }, token});
  });

  // Login route
app.post('/api/login', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required')
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body;
  
    // Find the user by email
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
  
    // Check if the password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
  
    const token = jwt.sign({ name: user.name, email: user.email }, process.env.JWT_SECRET);
  
    res.status(200).json({ user: { name: user.name, email: user.email }, token });
  });

const PORT = 8000; // Default port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});