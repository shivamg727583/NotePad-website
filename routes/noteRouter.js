const express = require('express')
const router = express.Router();
const userModel = require('../models/user');
const noteModel =require('../models/note');

const {isLoggedIn} = require('./userRouter');

router.get('/notes',isLoggedIn(),async (req,res)=>{
  try {
const user = await userModel.findById({_id:req.user.id})
    // console.log(user)
    const notes = await noteModel.find({user:user.id});
    res.render('notes', { notes ,user});
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }

})

router.get('/create',isLoggedIn() ,async (req, res) => {
const user = await userModel.findById({_id:req.user.id})

    res.render('create',{user});
  });
  
  router.post('/create',isLoggedIn() ,async (req, res) => {
    try {

      const { title, content } = req.body;
      await noteModel.create(
        { title, 
          content,
          user:req.user.id
        });
      res.redirect('/notes');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.get('/delete/:id', isLoggedIn(),async (req, res) => {
    try {
      const id = req.params.id;
      await noteModel.findOneAndDelete(id);
      res.redirect('/notes');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.get('/edit/:id', isLoggedIn(),async (req, res) => {
    try {
const user = await userModel.findById({_id:req.user.id})

      const note = await noteModel.findById(req.params.id);
      res.render('edit', { note ,user});
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.post('/update/:id', async (req, res) => {
    try {
      const { title, content } = req.body;
      await noteModel.findByIdAndUpdate(req.params.id, { title, content });
      res.redirect('/notes');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });




module.exports = router;