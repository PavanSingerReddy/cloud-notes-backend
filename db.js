const mongoose = require('mongoose');

const mongoURI =process.env.MONGO_URL



const connectToMongo = ()=>{

    mongoose.connect(mongoURI,{ config: { autoIndex: false } },()=>{

        console.log("successfully connected to mongo");
    });

}


module.exports = connectToMongo;