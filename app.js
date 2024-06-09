require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')
const cookie = require('cookie-parser');

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri).then(function(){
  console.log("MOngodb is connected")
}).catch(err=>{
  console.log("Error in mongodb connection : ",err)
});

const noteModel = require('./models/note'); // Corrected the model name for clarity
const userModel = require('./models/user');




const app = express();


const userRoute = require('./routes/userRouter').router;
const noteRoute = require('./routes/noteRouter');



app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(cookie());

app.use('/',userRoute);
app.use('/',noteRoute);


// // Navbar Links
// const navbarLinks = [
//   { name: 'Home', url: '/' },
//   { name: 'Create Note', url: '/create' },
//   { name: 'View Notes', url: '/notes' },
//   { name: 'Login', url: '/signin' },
//   { name: 'Register', url: '/signup' }

// ];

// app.locals.navbarLinks = navbarLinks;

app.get('/',async (req, res) => {

// let user= await userModel.findOne("")

 res.render('index');
});



// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
