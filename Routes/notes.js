const express = require('express');
const authorizeUser = require('../Middleware/authorizeUser');
const Notes = require('../Models/Notes') 

const router = express.Router();

const { body, validationResult } = require('express-validator');


//ROUTE 1 : fetch all notes of the user using : GET  "/api/notes/fetchallnotes" . login required
router.get('/fetchallnotes',authorizeUser, async(req, res) => {

       

  try {

    const allNotes = await Notes.find({user:req.user.id})
  
    res.json(allNotes)
    
  } catch (error) {
    

    console.error(error.message)
    res.status(500).send("internal server error")

  }
  

})








//ROUTE 2 : add the notes of the user using : POST  "/api/notes/addnotes" . login required
router.post('/addnotes',authorizeUser,[
  body('title','title should be minimum of 3 characters').isLength({min : 3}),
  body('description','description should be minimum of 5 character').isLength({min : 5}),
] , async (req, res) => {


  try {
    

    const errors = validationResult(req)


    // if there is a error while validating through express validator the below if runs
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {title,description,tags} = req.body


    const notes = await Notes.create({title,description,tags,user:req.user.id})


    res.json(notes)



  } catch (error) {

    console.error(error.message)
    res.status(500).send("internal server error")

  }


})









//ROUTE 3 : update the notes of the user using : PUT  "/api/notes/addnotes" . login required

router.put('/updatenote/:id',authorizeUser,[
  body('title','title should be minimum of 3 characters').isLength({min : 3}),
  body('description','description should be minimum of 5 character').isLength({min : 5}),
],async (req,res)=>{
  
  try {
    
    
    const errors = validationResult(req)
  
  
    // if there is a error while validating through express validator the below if runs
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
  
    const newNote = {}
  
    const {title,description,tags} = req.body
  
    let note = await Notes.findById(req.params.id)
  

    //check whether the note exists or not
    if(!note){
     return res.status(401).send('notes does not exist')
    }
  
  
  
    (title) && (newNote.title = title);
    (description) && (newNote.description = description);
    (tags) && (newNote.tags = tags);
  

    //check whether the note belongs to the particluar user
    if(note.user.toString()!== req.user.id){
      return res.status(401).send('permission denied')
    }
  
    note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
  
    res.send(note)
    
  } catch (error) {

    console.error(error)
    res.status(500).send("internal server error")
    
  }


  




})

















//ROUTE 3 : delete the notes of the user using : PUT  "/api/notes/addnotes" . login required

router.delete('/deletenote/:id',authorizeUser,async (req,res)=>{
  
  try {
    
    
  
    let note = await Notes.findById(req.params.id)
  

    //check whether the note exists or not
    if(!note){
     return res.status(401).send('notes does not exist')
    }
  
  
    //check whether the note belongs to the particluar user
    if(note.user.toString()!== req.user.id){
      return res.status(401).send('permission denied')
    }
  
    note = await Notes.findByIdAndDelete(req.params.id)
  
    res.json({success : "successfully deleted the note", note})
    
  } catch (error) {

    console.error(error)
    res.status(500).send("internal server error")
    
  }


  




})



module.exports = router;





