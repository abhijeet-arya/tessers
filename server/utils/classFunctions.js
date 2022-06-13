exports.takeFaceDecode = function(id,currentEncodes){
    for(var i=0;i<currentEncodes.length;i++){
        if(currentEncodes[i].id==id){
            return false
        }
    }
    return true
}