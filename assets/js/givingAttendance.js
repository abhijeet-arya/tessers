const socket = io('http://localhost');


const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  let classId = params.classId; 


  socket.emit('joinClass',classId);





var takePicture = function () {
    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.
    var width = 720;    // We will scale the photo width to this
    var height = 0;     // This will be computed based on the input stream
    console.log('var height width set')
    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.
  
    var streaming = false;
    var localstream;
    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.
  
    var video = null;
    var canvas = null;
    
  
    function showViewLiveResultButton() {
      if (window.self !== window.top) {
        // Ensure that if our document is in a frame, we get the user
        // to first open it in its own tab or window. Otherwise, it
        // won't be able to request permission for camera access.
        document.querySelector(".contentarea").remove();
        const button = document.createElement("button");
        button.textContent = "View live result of the example code above";
        document.body.append(button);
        button.addEventListener('click', () => window.open(location.href));
        return true;
      }
      return false;
    }
  
    function startup() {
      if (showViewLiveResultButton()) { return; }
      video = document.getElementById('video');
      canvas = document.getElementById('canvas');
  
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
      .then(function(stream) {
        video.srcObject = stream;
        localstream = stream;
        video.play();
        console.log('video.play')
      })
      .catch(function(err) {
        console.log("An error occurred: " + err);
      });
  
      video.addEventListener('canplay', function(ev){
          console.log('eventlistner canPlay')
        if (!streaming) {
            console.log('inside streaming');
          height = video.videoHeight / (video.videoWidth/width);
        
          // Firefox currently has a bug where the height can't be read from
          // the video, so we will make assumptions if this happens.
        
          if (isNaN(height)) {
            height = width / (4/3);
          }
        
          video.setAttribute('width', width);
          video.setAttribute('height', height);
          canvas.setAttribute('width', width);
          canvas.setAttribute('height', height);
          streaming = true;
        }
      }, false);
  
      $('#startbutton').click(function(ev){
        console.log('p')
        takepicture();
        ev.preventDefault();
      
        // clearInterval(attendanceInterval);
      
        $('#heading').css('display','none')
      
        video.pause();
        localstream.getTracks()[0].stop();
        
      });
      
      clearphoto();
    }
  
    // Fill the photo with an indication that none has been
    // captured.
  
    function clearphoto() {
      var context = canvas.getContext('2d');
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, canvas.width, canvas.height);
  
    }
    
    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.
  
    function takepicture() {
      var context = canvas.getContext('2d');
      if (width && height) {
          console.log('inside if of takepic')
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
      
      } else {
        clearphoto();
      }
    }
  
    // Set up our event listener to run the startup process
    // once loading is complete.
   startup();
    var i = 5;
   let attendanceInterval = setInterval(()=>{
      i -= 1;
      $('#count').html(`attendance in ${i}`)
      if(i==0){
        // $('#startbutton').click()
        takepicture();
        clearInterval(attendanceInterval);
        $('#count').html('')
        video.pause()
        localstream.getTracks()[0].stop();
        video.src=""
        sendImage();
      }
    }, 1000)
    


  }

  var sendImage = function(){
    var image = document.querySelector('#canvas').toDataURL();
    $.ajax('/api/givingAttendance',{
      type:'POST',
      dataType:'json',
      data:{image:image,classId:classId},
      success:function(data,status,xhr){
        console.log(data)
      }
    })
  }
  socket.on('takeAttendance',()=>{
    takePicture()
})

  