

var micOn = false;
var camOn = false;
var fullScreenOn = false;
var tileViewOn = false;
var handOn = false;
var screenShareOn = false;

var $fn;
$(document).ready(()=>{


// const roomId = $('#roomId').html()

    const domain = 'tessersroom.in';
    const options = {
    roomName: 'xyz',
    width: '100%',
    height: '100%',
    parentNode: document.querySelector('#meet'),
    onload: ()=>{
    $('.jss35').css('background-color','orange');
    }
};
// const api = new JitsiMeetExternalAPI(domain, options);
// api.addListener('readyToClose', ()=>{
//     console.log('close');
//     api.dispose();
// });


    $('.fa-minimize').hide()
    $('.fa-video-camera').hide()
    $('.fa-microphone').hide()
    $('.fa-phone').css('color','red')

    $('#hang').click(()=>{
        api.executeCommand('hangup');
    })


    $('#hand').click(function (){
        
        api.executeCommand('toggleRaiseHand')
        if(handOn){
            
            $(this).css('background-color','rgb(34,34,34)')
            handOn=false;
        }else{
            $(this).css('background-color','rgb(114,114,114)')
            handOn=true;
        }
       
    })

    $('#screenShare').click(function (){
        api.executeCommand('toggleShareScreen');
        if(screenShareOn){
            $(this).css('background-color','rgb(34,34,34)')
            screenShareOn=false;
        }else{
            $(this).css('background-color','rgb(114,114,114)')
            screenShareOn=true;
        }
       
    })

    $('#mic').click(function (){
        api.executeCommand('toggleAudio');
        if(micOn){
            $(this).css('background-color','rgb(34,34,34)')
            $('.fa-microphone').hide()
            $('.fa-microphone-slash').show()
            micOn=false;
        }else{
            $(this).css('background-color','rgb(114,114,114)')
            $('.fa-microphone-slash').hide()
            $('.fa-microphone').show()
            micOn=true;
        }
       
    })
    $('#cam').click(function (){
        api.executeCommand('toggleVideo');
        if(camOn){
            $(this).css('background-color','rgb(34,34,34)')
            $('.fa-video-camera').hide()
            $('.fa-video-slash').show()
            camOn=false;
        }else{
            $(this).css('background-color','rgb(114,114,114)')
            $('.fa-video-slash').hide()
            $('.fa-video-camera').show()
            camOn=true;
        }
       
    })
    $('#tileView').click(function (){
        api.executeCommand('toggleTileView');
        if(tileViewOn){
            $(this).css('background-color','rgb(34,34,34)');
            tileViewOn=false
        }else{
            $(this).css('background-color','rgb(114,114,114)');
            tileViewOn=true;
        }
    })
    
    $('#fullScreen').click(()=>{
        var d={}
        var speed=300;
        if(fullScreenOn){
            d.width = '80%';
            d.height= '92%';
            $('.navbar').show();
            $('#message').show();
            fullScreenOn = false;
        }else{
            $('.navbar').hide();
            $('#message').hide();
            d.width='100vw';
            d.height='100vh';
            fullScreenOn=true;
        }
        $('#meet').animate(d,speed);
    })
    
    $('.videoButton').mouseover(function(){
        var p =""
        switch($(this).attr('id')){
            case 'hand':
                if(handOn){
                    p = 'lower hand';
                }else{
                    p = 'raise hand'
                }
                
                break;
            case 'screenShare':
                if(screenShareOn){
                    p = ' stop screen share'
                }else{
                    p = 'start screen share'
                }
                break;
            case 'mic':
                if(micOn){
                    p = 'mute'
                }else{
                    p = 'unmute'
                }
                break;
            case 'hang':
                p = 'hang up';
                break;
            case 'cam':
                if(camOn){
                    p = 'stop camera';
                }else{
                    p = 'start camera';
                }
                
                break;
            case 'tileView':
                if(tileViewOn){
                    p = 'switch single view'
                }else{
                    p = ' switch tile view'
                }
                break;
            case 'fullScreen':
                if(fullScreenOn){
                    p= 'exit full screen';
                }else{
                    p= 'full screen'
                }
               
                break;
            case 'options':
                p = 'options';
                break;
            default:
                p = ''
                
        }
        $('#videoBtnTag').html(p);
        position = $(this).offset()
        const top = position.top-30;
        const left = position.left+$(this).width()/2-$('#videoBtnTag').width()/2;
        $('#videoBtnTag').css({
            'top': `${top}px`,
            'left':`${left}px`
        })
        $('#videoBtnTag').show()
    })
    $('.videoButton').mouseout(()=>{
        $('#videoBtnTag').hide()
    })


})

