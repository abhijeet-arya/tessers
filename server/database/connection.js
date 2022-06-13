const mongoose = require('mongoose');
const multer = require('multer')
const {GridFsStorage} = require('multer-gridfs-storage')
const Grid = require('gridfs-stream');
const path = require('path');
const dotenv = require('dotenv');
const crypto = require('crypto')
dotenv.config( { path : 'config.env'} )
let storage;
exports.connectDB = async ()=>{
    try{
       const conn = await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,

        })
        console.log(`Mongodb connected:${conn.connection.host}`)
            // console.log(conn.connection.db)
            const gfs = Grid(conn.connection.db, mongoose.mongo);
            gfs.collection('uploads');
            
            
            
    }catch(err){
        console.log(err);
        process.exit(1);
    }
} 

exports.createStorage = ()=>{
  storage = new GridFsStorage({
    url:process.env.MONGO_URL,
    // db:conn.connection.db,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  exports.upload = multer({storage})
}

