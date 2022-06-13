
const classAttendance =[]

exports.addClass= (classId,attendance)=>{
    classAttendance.push({classId:classId,data:attendance})
    console.log(classAttendance)
}
exports.updateClassTotal=(classId)=>{
    for(var i=0; i<classAttendance.length;i++){
        if(classAttendance[i].classId==classId){
            classAttendance[i].data.total++
            return
        }
    }
}
exports.updateAttendance = (classId,userId)=>{
    for(var i=0;i<classAttendance.length;i++){
        if(classAttendance[i].classId==classId){
            classAttendance[i].data[userId]++;
            return
            
        }
    }
}
exports.getClassAttendance=(classId)=>{
    for(var i=0;i<classAttendance.length;i++){
        if(classAttendance[i].clssId==classId){
            return classAttendance[i].data
        }
    }
}


