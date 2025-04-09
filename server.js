// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session'); // Optional: Remove if not using sessions

// Import routes
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const Contact = require('./models/contactus');


const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Express session (if you wish to continue using sessions without Passport)
app.use(session({
  secret: 'your_session_secret', // Replace with a secure secret
  resave: false,
  saveUninitialized: false
}));

// Remove Passport initialization and session handling
// No Passport setup is done here since authentication will need to be handled differently.

// Connect to MongoDB (adjust connection string as needed)
mongoose.connect('mongodb://localhost:27017/lostfound')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));
// Serve the uploaded images specifically
app.use('/images/uploads', express.static(path.join(__dirname, 'public/images/uploads')));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);


app.post('/contactus', async (req, res) => {
  try {
    console.log("Received data:", req.body);
    const { name, email, subject, message } = req.body;
    const newContact = new Contact({
      fullname: name,        
      EmailAddress: email,    
      Subject: subject,             
      Message: message      
    });
    
    await newContact.save();
    console.log("Saved new contact:", newContact);

    res.status(200).send("Thank you for submitting your message. We will get back to you soon.");
  } catch (error) {
    console.error("Error saving contact information:", error);
    res.status(500).send("There was an error processing your request. Please try again later.");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

