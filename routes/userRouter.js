const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')
const cookie = require('cookie-parser');

// Render signup page
router.get('/signup', async (req, res) => {
  try {
    const users = await userModel.find();
    res.render('signup', { title: "Sign Up", users, message: null });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Handle signup form submission
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.render('signup', { message: "Email already exists", title: "Sign Up", users: [] });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword
    });

   let token = jwt.sign({email:newUser.email,id:newUser._id},"secret");
   res.cookie("token",token);
  
    res.redirect('/signin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Render signin page
router.get('/signin', async (req, res) => {
  try {
    const users = await userModel.find();
    res.render('signin', { title: "Sign In", users, message: null });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.render('signin', { message: "Invalid email or password", title: "Sign In" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('signin', { message: "Invalid email or password", title: "Sign In" });
    }
    let token = jwt.sign({email:user.email,id:user._id},"secret");
    res.cookie("token",token);

    res.redirect('/notes');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});



function isLoggedIn(){
  return (req,res,next)=>{
    if(req.cookies.token){
      jwt.verify(req.cookies.token,"secret",(err,decoded)=>{
        if(err){
          res.clearCookie("token");
          res.redirect('/signin');
          }else{
            req.user=decoded;
            next();
            }
            });
            }else{
              res.redirect('/signin');
              }
              }

}

router.get('/logout',(req,res)=>{
  res.clearCookie("token");
  res.redirect('/signin');
})


module.exports = {router , isLoggedIn};
