const userDB = require("../model/model");
const createRoom = require("../model/createRoomModel");
const privateClass = require('../model/privateClassModel')
const classPost = require('../model/classPostModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const querystring = require('querystring');
const crypto = require('crypto');
const { spawn } = require('child_process');
const res = require("express/lib/response");
const attendance = require('../../attendance/attendance')
const months = ['Jan','Feb','March','April','May','June','July','Aug','Sept','Oct','Nov','Dec']

const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

exports.newUser = async (req,res)=>{
    if(!req.body){
        return res.status(400).redirect('/signUp');
    }
    const {firstName,lastName,email,password,confirmPassword,accountType} = req.body;

    if(!firstName){
        req.flash('error','first name cannot be empty')
        return res.redirect('/signUp');
    }
    if(!lastName){
        req.flash('error','last name cannot be empty')
        return res.redirect('/signUp');
    }
    if(!email){
        req.flash('error','Email cannot be empty')
        return res.redirect('/signUp');
    }
    if(!validateEmail(email)){
        req.flash('error','Invalid email')
        return res.redirect('/signUp');
    }
    if(password.length<8){
        req.flash('error','password must contain 8 characters')
        return res.redirect('/signUp');
    }
    if(password!=confirmPassword){
        req.flash('error',"password doesn't match")
        return res.redirect('/signUp');
    }
    const cryptedPassword = bcrypt.hashSync(password);
    try{
        const response = await userDB.create({
            firstName,
            lastName,
            email,
            password:cryptedPassword,
            accountType,
        })
        const token = jwt.sign({
            id: response._id,
            firstName: response.firstName,
            lastName: response.lastName,
            accountType:response.accountType,
        },process.env.JWT_NUCLEAR_SECRET)
       res.cookie('jwt',token,{
           httpOnly:true,
       });
       if(response.accountType=='teacher'){return res.redirect('/teaching');}
        else return res.redirect('/learning');
    }catch(err){
        if(err.code== 11000){
            req.flash('error','user already exist')
            return res.redirect('/signUp')
        }
        throw err;
    }
    
}

exports.login = async (req,res)=>{
    const {email,password} = req.body;
    if(!email){
        req.flash('error','Email cannot be empty')
            return res.redirect('/login');
    }else if(!password){
        req.flash('error','Password cannot be empty')
            return res.redirect('/login');
    }else{
        const user = await userDB.findOne({email}).lean();
        if(!user){
            
            req.flash('error','Invalid email')
           return res.redirect('/login');
        }
        else if(await bcrypt.compare(password,user.password)){
            const token = jwt.sign({
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                accountType: user.accountType
            },process.env.JWT_NUCLEAR_SECRET)
           res.cookie('jwt',token,{
               
               httpOnly:true,
           });
           if(user.accountType=='teacher'){return res.redirect('/teaching');}
           else return res.redirect('/learning');
           
        }else{
            req.flash('error','invalid password')
           return res.redirect('/login');
        }
    }
}

exports.createRoom = async (req,res)=>{
    while(true){
        var generatedRoomId = crypto.randomBytes(3).toString('hex')
        try{
            const response = await createRoom.create({
                roomId:generatedRoomId,
                roomType:'normal'
            })
            req.flash('itsMe',true);
           return res.redirect(`/tessersroom?roomId=${response.roomId}`);
        }catch(err){
            if(err.code==1100){
                continue;
            }else{
                throw err;
            }
        }
    }
}

exports.joinClass = async (req,res)=>{
    
    try{
        const user = jwt.verify(req.cookies.jwt,process.env.JWT_NUCLEAR_SECRET);
        
        const classRes = await privateClass.findOne({classId:req.body.classId})
        if(classRes){
            
            if(!classRes.usersJoined.includes(user.id)){
                const userJoined = await privateClass.updateOne(
                    {classId:req.body.classId},
                    {$push:{usersJoined:{id:user.id,name:`${user.firstName} ${user.lastName}`}}}
                    )
                if(userJoined.acknowledged){
                    
                    res.json({
                        className:classRes.className,
                        subName:classRes.subName,
                        classId:classRes.classId
                    })
                }else{
                    console.log(userJoined)
                }
            }else{

            }
        }else{

        }
        
    }catch(err){
        console.log(err)
    }
}

exports.joinRoom = async (req,res)=>{
    const inputRoomId = req.body.roomId;
    const room =  await createRoom.findOne({roomId:inputRoomId});
    if(room){
        return res.render('tessersRoom',{roomId:room.roomId})
    }
}

exports.createPrivateClass = async (req,res)=>{
    console.log(req.body);
    
    while(true){
        var generatedRoomId = crypto.randomBytes(3).toString('hex')
        try{
            const room = await createRoom.create({
                roomId:generatedRoomId,
                roomType:'private'
            })
            try{
                const user = jwt.verify(req.cookies.jwt,process.env.JWT_NUCLEAR_SECRET)
                const response = await privateClass.create({
                    teacherId:user.id,
                    teacherName:`${user.firstName} ${user.lastName}`,
                    classId:room.roomId,
                    className:req.body.className,
                    subName:req.body.subName,
                    takeAttendance:req.body.takeAttendance == 'yes' ? true : false,
                    restrictUser: req.body.restrictUser == 'yes' ? true : false,
                })
              return res.json({className:response.className,subName:response.subName,classId:response.classId});
            }catch(err){
              return res.json(err)
            }
        }catch(err){
            if(err.code==1100){
                continue;
            }else{
                throw err;
            }
        }
    }
}

exports.postAnnouncement = async (req,res)=>{
    const date = new Date();
    const datePosted = `${months[date.getMonth()]} ${date.getDate()}`
    try{
        const user = jwt.verify(req.cookies.jwt,process.env.JWT_NUCLEAR_SECRET)
        const response = await classPost.create({
        classId:req.body.classId,
        postType:'announcement',
        userName:`${user.firstName} ${user.lastName}`,
        heading:req.body.heading,
        body:req.body.body,
        datePosted:datePosted,
        })
        if(response){
            res.json(response);
        }
    }catch(err){
        console.log(err)
    }
        
        
}

exports.postClassWork = async (req,res)=>{
    const date = new Date();
    const datePosted = `${months[date.getMonth()]} ${date.getDate()}`
    
    try{
        const user = jwt.verify(req.cookies.jwt,process.env.JWT_NUCLEAR_SECRET)
        const response = await classPost.create({
            classId:req.body.classId,
            postType:'classWork',
            userName:`${user.firstName} ${user.lastName}`,
            heading:req.body.heading,
            body:req.body.body,
            datePosted:datePosted,
            submissionDate:req.body.submissionDate,
            marks:req.body.marks,
            })
            res.json(response);
    }catch(err){
        console.log(err);
    }
}

exports.postComment = async (req,res)=>{
    try{
        const user = jwt.verify(req.cookies.jwt,process.env.JWT_NUCLEAR_SECRET);
        const date = new Date();
        const datePosted = `${months[date.getMonth()]} ${date.getDate()}`
        const response = await classPost.updateOne(
            {_id:req.body.id},
            {$push:{comments:{userName:`${user.firstName} ${user.lastName}`,
                            comment:req.body.comment,
                            datePosted: datePosted,
                        }}})
            
            res.json({
                userName:`${user.firstName} ${user.lastName}`,
                comment:req.body.comment,
                datePosted:datePosted

            })
        
    }catch(err){
        console.log(err);
    }
}

exports.uploadFaceEncoding =(req,res)=>{
    try{
        const user = jwt.verify(req.cookies.jwt,process.env.JWT_NUCLEAR_SECRET);
        
        req.body.image= req.body.image.replace(/data:image\/png;base64,/, "");
        const childPython = spawn('python',['./python/faceEncodings.py',req.body.image]);
        childPython.stdout.on('data',async (data)=>{
            const faceEncode = data.toString().replace('\n','')
            const faceData = {
                id:user.id,
                faceEncode:faceEncode,
            }
            const classRes = await privateClass.findOneAndUpdate(
                {classId:req.body.classId,},
                {$push:{faceEncodes:faceData}},{new:true})
            if(classRes){
                res.json({status:'ok'})
            }else{
                res.json({status:'error'})
            }
        
        })
        childPython.stderr.on('data',data=>{
            console.log(data.toString())
        })
    }catch(err){
        res.json({status:'error'})
    }
    
    
}


exports.givingAttendance= async (req,res)=>{
    try{
        const user = jwt.verify(req.cookies.jwt,process.env.JWT_NUCLEAR_SECRET);
        req.body.image= req.body.image.replace(/data:image\/png;base64,/, "");
        try{
            const classRes = await privateClass.findOne({classId:req.body.classId});
            if(classRes){
                var faceEncode=''
            for(var i=0;i<classRes.faceEncodes.length;i++){
                if(classRes.faceEncodes[i].id==user.id){
                    faceEncode=classRes.faceEncodes[i].faceEncode;
                    break;
                }
            }
            const childPython = spawn('python',['./python/attendance.py',faceEncode,req.body.image])

            childPython.stdout.on('data',data=>{
            
                console.log(data=='True',data)
                if(data =='True'){
                    console.log('True')
                    attendance.updateAttendance(req.body.classId,user.id)
                    res.json('True')
                }
                else{
                    console.log('False')
                    res.json('False')
                }
                // const updateAttendance = await privateClass.findOneAndUpdate({classId:req.body.classId,"attendance.date":date},
                // {$inc:{`attendance.$.${user.id}`: 1 }})
            })
            childPython.stderr.on('data',data=>{
                console.log(data.toString())
            })
            
            }
            
        }catch(err){
            console.log(err)
        }
    }catch(err){
        console.log(err)
    }
}