var express = require('express');
var router = express.Router();
const Users = require('../Models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const authorizeUser = require('../Middleware/authorizeUser');




const JWT_SECRET = "iam a good bo$y"



//ROUTE 1 : create a user using : POST  "/api/auth/createuser" . login not required
router.post('/createuser',[
  body('name','enter the valid name').isLength({min : 5}),
  body('password','enter valid password').isLength({min:6}),
  body('email','enter a valid email').isEmail()
] ,
async(req, res) => {
  
  const errors = validationResult(req)         //validating with express validator
  let success = false

  // if there is a error while validating through express validator the below if runs
  if (!errors.isEmpty()) {
    return res.status(400).json({success,errors: errors.array() });
  }


// adding try catch  
  try{
    
    
    //checking to see if the users already exists in the database

    let user = await Users.find({email : req.body.email})

    // console.log(user)
  
    if(user.length){
        return res.status(400).send({success,message:"sorry already user exists with this email"})

    }
  

        const saltRounds = 10;

        const salt =  bcrypt.genSaltSync(saltRounds);
        const securePassword = await bcrypt.hash(req.body.password, salt);
    
  
    //if there is no error the users gets created 
      user =  await Users.create({
              name: req.body.name,
              password: securePassword,
              email : req.body.email
              })
  


              const data = {
                user : {
                  id : user.id
                }
              }

              
              const authToken = jwt.sign(data,JWT_SECRET);

              // console.log(authToken)
              success = true
  
              res.json({success,authToken})
  
  
    


  } catch(error){

    console.error(error.message)
    res.status(500).send("internal server error")
  }


})








//ROUTE 2 : logging in a user using : POST  "/api/auth/login" . login not required

router.post('/login',[
  body('email','enter a valid email').isEmail(),
  body('password','enter valid password').exists().isLength({min:6})
],
async(req, res) => {
  
  const errors = validationResult(req)
  let success = false

  // if there is a error while validating through express validator the below if runs
  if (!errors.isEmpty()) {
    return res.status(400).json({success,errors: errors.array() });
  }

  try {
        //checking to see if the users already exists in the database

        const {email,password} = req.body

        let user = await Users.find({email : email}) //returns array of found products
  
        if(!user.length){
            return res.status(400).send({message:'incorrect credentials',success:success})
    
        }


        // console.log(req.body)
        // console.log(user[0].password)
        const authenticate = bcrypt.compareSync(password,user[0].password);     //it is an synchronous function unlike compare which is asynchronous


        if(!authenticate){
         return  res.status(400).send({message:'incorrect credentials',success:success})
        }



              const data = {
                user : {
                  id : user[0].id
                }
              }

              
              const authToken = jwt.sign(data,JWT_SECRET);

              // console.log(authToken)

              success = true
  
              res.json({success,authToken})
        




  } catch (error) {
    console.error(error)

    res.status(500).send("internal server error")
  }

})








//ROUTE 3 : Get logged in user Details using : POST '/api/auth/getuser' . login required



router.post('/getuser',authorizeUser,async (req,res)=>{



  try {

    // console.log(req.user.id)

    const userId = req.user.id
  
    const user =  await Users.findById(userId).select('-password')
  
    res.json(user)
    
  } catch (error) {

    console.error(error)

    res.status(500).send("internal server error")

  }


})

module.exports = router;