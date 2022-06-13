const express = require('express');
const render = require('../services/render')
const route = express.Router();

const controller = require('../controller/controller');


const database = require('../database/connection');

route.get('/',render.homeRoute);

route.get('/forTeaching',render.forTeaching);
route.get('/teaching',render.teaching)
route.get('/learning',render.learning);
route.get('/forLearning',render.forLearning);
route.get('/login',render.login);
route.get('/signUp',render.signUp);
route.get('/createRoom',controller.createRoom);
route.get('/tessersroom',render.tessersroom);
route.get('/fileupload',(req,res)=>{
    res.render('fileUpload')
})

route.get('/api/joinPrivateClass',render.joinPrivateClass)
route.get('/api/startPrivateClass',render.startPrivateClass)

route.get('/classWork',render.classWork)

route.post('/api/postAnnouncement',controller.postAnnouncement)

route.post('/api/postComment',controller.postComment);
route.post('/api/postClassWork',controller.postClassWork);

route.post('/api/joinClass',controller.joinClass)
route.post('/joinRoom',controller.joinRoom);

route.post('/api/createPrivateClass',controller.createPrivateClass);
route.post('/api/newUser',controller.newUser);
route.post('/api/login',controller.login);

route.post('/api/uploadFaceEncoding',controller.uploadFaceEncoding);
route.post('/api/givingAttendance',controller.givingAttendance);

route.post('/example',database.upload.single('file'), (req,res)=>{
    res.json({file:req.file})
})

module.exports = route;