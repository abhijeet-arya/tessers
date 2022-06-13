

const createBtn = document.getElementById('createBtn');
const showCreateBtns = document.getElementById('showCreateBtns');

const createPaidClass = document.getElementById('createPaidClass');
const createPrivateClass = document.getElementById('createPrivateClass');

$(document).ready(()=>{
    createBtn.onclick = ()=>{
        showCreateBtns.style.display='flex';
    }
    
    $('#profile').click(()=>{
        $('#profileBtns').css('display','flex');
    })
    
    $('#joinRoom').click(()=>{
        $('#showCreateBtns').hide();
        $('#joinForm').show();
    })
    
    createPaidClass.onclick = ()=>{
        showCreateBtns.style.display='none';
        $("#paidClassCont").css('display','flex')
    }
    createPrivateClass.onclick = ()=>{
        showCreateBtns.style.display='none';
        $('#privateClassCont').css('display','flex')
    }
    
    $(document).mouseup(function(e) 
    {
        var container = $("#showCreateBtns")
        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) 
        {
            container.hide();
        }
    });
    $(document).mouseup(function(e) 
    {
        var privateClassCont = $("#privateClassCont")
        // if the target of the click isn't the container nor a descendant of the container
        if (!privateClassCont.is(e.target) && privateClassCont.has(e.target).length === 0) 
        {
            privateClassCont.hide();
        }
        var paidClassCont = $("#paidClassCont")
        // if the target of the click isn't the container nor a descendant of the container
        if (!paidClassCont.is(e.target) && paidClassCont.has(e.target).length === 0) 
        {
            paidClassCont.hide();
        }
        var joinRoomContainer = $("#joinRoomCont")
        // if the target of the click isn't the container nor a descendant of the container
        if (!joinRoomContainer.is(e.target) && joinRoomContainer.has(e.target).length === 0) 
        {
            $('#joinForm').hide();
        }
        var profileBtns = $("#profileBtns")
        // if the target of the click isn't the container nor a descendant of the container
        if (!profileBtns.is(e.target) && profileBtns.has(e.target).length === 0) 
        {
            $('#profileBtns').hide();
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
    
    $('.fa-times').click(()=>{
        $('#privateClassCont').hide();
        $('#paidClassCont').hide()
    })

    $('#classMainCont').on('click','.classCont',function(){
        location.href = `/teaching?classId=${$(this).find('.classId').html()}`;
    })

    $('#privateClassForm').submit((e)=>{
        e.preventDefault();
        var data ={}
        data.className = $('#className').val()
        data.subName = $('#subName').val()
        data.takeAttendance = $("input[type='radio'][name='takeAttendance']:checked").val();
        data.restrictUser = $("input[type='radio'][name='restrictUser']:checked").val();
        $.ajax('/api/createPrivateClass',{
            type:'POST',
            dataType:'json',
            data:data,
            success:function(data,status,xhr){
                    var classCont = $("<div class='classCont'></div>"); 
                    var className = $("<p class='className'></p>").text(data.className); 
                    var subName = $("<p class='subName'></p>").text(data.subName);
                    var classId = $("<span></span>").html(`class Id:<p class='classId'>${data.classId}</p>`);
                    
                    classCont.append(className,subName,classId);
                    $('#classMainCont').append(classCont);
                    $('#privateClassCont').hide();
            },
            
        })
        // const xhr = new XMLHttpRequest();

        // xhr.open('POST','/api/createPrivateClass',true);
        // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // xhr.onprogress = ()=>{
        //     console.log('creating room');
        // };

        // xhr.onload = function(){
        //    
                
            
            
        // }

        // xhr.send();
    })


})