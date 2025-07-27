const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const Contact = require('./models/contactus');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'Your-Default-Secret-Change-Me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, 
  }
}));


mongoose.connect('mongodb://localhost:27017/lostfound')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use(express.static(path.join(__dirname, 'public')));
app.use('/images/uploads', express.static(path.join(__dirname, 'public/images/uploads')));


app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);


app.post('/contactus', async (req, res) => {
  try {
    console.log("Received contact data:", req.body);
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


app.use((req, res, next) => {
  console.log('Session data:', req.session);
  next();
});


function requireAuth(req, res, next) {
  if (req.session && req.session.userId && req.session.loginTime) {
    const sessionAge = Date.now() - req.session.loginTime;
    console.log(`Session age: ${sessionAge}ms`);
    if (sessionAge < 2 * 60 * 1000) { 
      return next();
    } else {
      req.session.destroy(() => {
        console.log("Session expired. Redirecting to home.");
        return res.redirect('/');
      });
    }
  } else {
    console.log("No valid session found. Redirecting to home.");
    return res.redirect('/');
  }
}


app.get('/', (req, res) => {
  console.log("Accessing / route");
  if (req.session && req.session.userId && req.session.loginTime) {
    const sessionAge = Date.now() - req.session.loginTime;
    console.log(`Session age in root: ${sessionAge}ms`);
    if (sessionAge < 2 * 60 * 1000) {
      console.log("Valid session found. Redirecting to /dashboard.");
      return res.redirect('/dashboard');
    } else {
      req.session.destroy(() => {
        console.log("Session expired at root. Serving index.html.");
        return res.sendFile(path.join(__dirname, 'public', 'index.html'));
      });
    }
  } else {
    console.log("No session data at root. Serving index.html.");
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

app.get('/dashboard', requireAuth, (req, res) => {
  console.log("Serving dashboard.html");
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});


app.get('/master', requireAuth, (req, res) => {
  console.log("Serving master.html");
  res.sendFile(path.join(__dirname, 'public', 'master.html'));
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
