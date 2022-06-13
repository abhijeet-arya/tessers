const res = require("express/lib/response");
const jwt = require('jsonwebtoken');
const createRoom = require('../model/createRoomModel')
const privateClass = require('../model/privateClassModel')
const classPost = require('../model/classPostModel');
const classFunctions = require('../utils/classFunctions')
const attendance = require('../../attendance/attendance')
exports.homeRoute = (req,res)=>{
    
    res.render('index');
}

exports.forTeaching = (req,res)=>{
    res.render('forTeaching')
}
exports.forLearning = (req,res)=>{
    const message=req.flash('error') ?? "";
    res.render('login', { message });
}

exports.login = (req,res)=>{
   const message=req.flash('error') ?? "";
    res.render('login',{ message });
    
    
}

exports.signUp= (req,res)=>{
    const message=req.flash('error') ?? "";
    res.render('signUp',{message});
}

exports.teaching = async (req,res)=>{
    try{
        const userJwt = req.cookies.jwt;
        const user = jwt.verify(userJwt,process.env.JWT_NUCLEAR_SECRET);
        
        if(req.query.classId){
            const classRes = await privateClass.findOne({classId:req.query.classId})
            if(classRes){
                if(user.id==classRes.teacherId){
                    try{
                        const classPostRes = await classPost.find({
                            classId:classRes.classId
                        }).sort({time:-1})
                    res.render('teachingPrivateClass',{classPostData:classPostRes,classData:classRes})
                    }catch(err){
                        console.log(err)
                    }
                    
                }else{
                    res.render('errPage',{message:"your don't have access to this class"})
                }
            }else{
                res.render('errPage',{message:"Invalid class Id"})
            }
        }else{
        if(user.accountType=='teacher'){
            const response = await privateClass.find({teacherId:user.id})
            res.render('teaching',{classes:response});
        }else{
            res.render('errPage',{message:"your account type doesn't have access to this page"})
        }
    }
        
    }catch{
        res.redirect('/login');
    }
    
}

exports.tessersroom= async (req,res)=>{
    try{
        const user = jwt.verify(req.cookies.jwt,process.env.JWT_NUCLEAR_SECRET)
        var itsMe = req.flash('itsMe');

        if(req.query.roomId){
            if(itsMe[0]){
                
            return res.render('tessersRoom',{roomId:req.query.roomId});
            }else{
             const room = await createRoom.findOne({roomId:req.query.roomId});
             if(room){
                 res.render('tessersRoom',{roomId:req.query.roomId});
             }else{
                 res.render('errPage',{message:'Invalid room id'});
             }
            }
     
        }else if(req.query.classId){
            if(itsMe[0]){
            return res.render('tessersRoomTeacher',{roomId:req.query.classId});
            }else{
             const classRes = await privateClass.findOne({roomId:req.query.classId});
             if(classRes){

                for(var i=0;i<classRes.usersJoined.length;i++){
                    
                    if(classRes.usersJoined[i].id==user.id){
                        return res.render('tessersRoomStudent',{roomId:req.query.classId});
                     }
                }
                 
               return res.render('errPage',{message:'class not joined'})
                 
                 
             }else{
                return res.render('errPage',{message:'Invalid class id'});
             }
            }
     
        }else{
            res.render('errPage',{message:'Invalid room id'})
        }
    }catch{
        res.redirect('/login');
    }
    
    
}

exports.learning = async (req,res)=>{
    try{
        const user = jwt.verify(req.cookies.jwt,process.env.JWT_NUCLEAR_SECRET)
        if(req.query.classId){
            const classRes = await privateClass.findOne({classId:req.query.classId})
            if(classRes){
               
                if(classRes.usersJoined.includes(user.id)){
                    const classPostRes = await classPost.find({
                        classId:classRes.classId
                    }).sort({time:-1})
                
                        if(classRes.takeAttendance && classFunctions.takeFaceDecode(user.id,classRes.faceEncodes)){
                            var takePic = true
                        }else{
                            var takePic = false
                        }
                    res.render('learningPrivateClass',{classPostData:classPostRes,classData:classRes,takePic:takePic});
                }else{
                    res.render('errPage',{message:'class not joined'})
                }
            }else{
                res.render('errPage',{message:'Invalid class id'})
            }
        }else{
            if(user.accountType=='student'){
                const classesJoined = await privateClass.find({usersJoined:{$elemMatch:{id:user.id}}})
                res.render('learning',{data:classesJoined})
            }else{
                res.render('errPage',{message:"your account type doesn't have access to this page"})
            }
        }
        
    }catch(err){
        console.log(err)
        req.session.redirectTo = '/learning';
        res.redirect('/login')
    }
    
}

exports.startPrivateClass = async (req,res)=>{
    try{
        const user = jwt.verify(req.cookies.jwt,process.env.JWT_NUCLEAR_SECRET)
        
        try{
            const classRes = await privateClass.findOneAndUpdate({classId:req.query.classId,teacherId:user.id},
                [{$set:{classStarted:{"$not":"$classStarted"}}}],{new:true})
            if(classRes.classStarted){
                if(classRes.takeAttendance){
                    const date=Date.now()
                    var toDay={date:date,
                                total:0}
                    console.log(classRes.usersJoined[0])
                    for(var i=0 ;i<classRes.usersJoined.length;i++){
                        toDay[classRes.usersJoined[i].id]=0
                    }
                    attendance.addClass(req.query.classId,toDay)
                }
                req.flash('itsMe',true);
               return res.redirect(`/tessersroom?classId=${req.query.classId}`);
            }else{
                const data = attendance.getClassAttendance(req.body.classId)
                console.log(data)
                const updateAttendance = await privateClass.updateOne({classId:req.query.classId},{
                    $push:{attendance:data}
                })
                console.log(updateAttendance)

                res.redirect(`/teaching?classId=${req.query.classId}`)
            }
        }catch(err){
            console.log(err)
        }
        
    }catch(err){
        res.redirect('/login')
    }
}

exports.joinPrivateClass = async (req,res)=>{

}

exports.classWork= async (req,res)=>{
    try{
        const user = jwt.verify(req.cookies.jwt,process.env.JWT_NUCLEAR_SECRET)
        if(req.query.classId && req.query.classWorkId){
            const classRes = await privateClass.findOne({classId:req.query.classId})
            if(classRes){
                if(classRes.teacherId==user.id){
                    const postRes = await classPost.findOne({_id:req.query.classWorkId})
                            if(postRes){
                                res.render('classWork.ejs',{data:postRes})
                            }
                }else{
                    for(var i=0;i<classRes.usersJoined.length;i++){
                        console.log('l')
                        if(usersJoined[i].id==user.id){
                            const postRes = await classPost.findOne({_id:req.query.classWorkId})
                            console.log(postRes)
                        }
                    }
                }
                    
            }else{
                return res.render('errPage',{message:'Invalid ClassId'})
            }
        }else{
            res.render('/errPage',{message:"Invalid link"})
        }
    }catch(err){

    }
    
}
