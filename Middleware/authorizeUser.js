var jwt = require('jsonwebtoken');


const JWT_SECRET = "iam a good bo$y"




const authorizeUser = async (req,res,next)=>{

    try {

        const authToken = req.header('JWT-TOKEN')

        if(!authToken){
            return res.status(401).json({error : 'authenticate using a valid token'})
        }
        const data =await jwt.verify(authToken,JWT_SECRET)
        
        // console.log(data)
        req.user = data.user
        next()
        
    } catch (error) {
        console.log(error)
        return res.status(401).json({error : 'authenticate using a valid token'})
    }

}



module.exports = authorizeUser