$(document).ready(()=>{
    $('#uploadPicBtn').hide()
$('#profilePicCont').add

$("#profilePicCont").on({
    mouseenter: function () {
        $('#uploadPicBtn').show()
    },
    mouseleave: function () {
        $('#uploadPicBtn').hide()
    }
});

$('#profilePicFile').on('change',function(){
    const choosedPic = this.files[0];

    if(choosedPic){
        const reader = new FileReader()
        
        reader.addEventListener('load',function(){
            $("#profilePic").attr("src",reader.result);
        })

        reader.readAsDataURL(choosedPic)
    }

    
})

})