const createBtn = document.getElementById('createBtn');
const showCreateBtns = document.getElementById('showCreateBtns');
createBtn.onclick = ()=>{
    showCreateBtns.style.display='block';
}



$('#joinRoom').click(()=>{
    $('#showCreateBtns').hide();
    $('#joinRoomForm').show();
})

$('#joinClass').click(()=>{
    $('#showCreateBtns').hide();
    $('#joinClassForm').show();
})


$('#joinClassForm').submit(function(e){
    e.preventDefault();
    const data = {
        classId:$('#classId').val()
    }
    $.ajax('/api/joinClass',{
        type:'POST',
        dataType:'json',
        data:data,
        success:function(data,status,xhr){
            const rndInt = Math.floor(Math.random() * 6) + 1
            var classCont = $(`<div class='classCont' style="background-image: url('/img/class/${rndInt}.jpg')"></div>`); 
                    var className = $(`<p class='className'>${data.className}</p>`)
                    var subName = $(`<p class='subName'>${data.subName}</p>`)
                    var classId = $(`<span>class Id:<p class='classId'>${data.classId}</p></span>`)
                    
                    classCont.append(subName,className,classId);
                    $('#classMainCont').append(classCont);
                    $("#joinClassForm")[0].reset();
                    $('#joinClassForm').hide();
        },

    })
})
$('#classMainCont').on('click','.classCont',function(){
    location.href = `/learning?classId=${$(this).find('.classId').html()}`;
})

$(document).mouseup(function(e) 
{
    var container = $("#showCreateBtns")
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
        container.hide();
    }
    var joinRoomContainer = $(".joinCont")
    // if the target of the click isn't the container nor a descendant of the container
    if (!joinRoomContainer.is(e.target) && joinRoomContainer.has(e.target).length === 0) 
    {
        $('.joinForm').hide();
    }
});



$('#createRoom').click(()=>{
    
})
$('#joinBtn').click(()=>{
    console.log($('#roomId').val())
})

$('#createRoom').click(()=>{
    
    const xhr = new XMLHttpRequest();

    xhr.open('get','/createRoom',true)

    xhr.onprogress = function(){

    }

    xhr.onload = function(){
        console.log(this.responseText);
    }

    xhr.send();
})