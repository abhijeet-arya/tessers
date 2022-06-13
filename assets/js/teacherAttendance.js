const socket = io('http://localhost');



const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  let classId = params.classId; 

socket.emit('joinClass',classId);

setInterval(()=>{
    console.log('attendance')
    socket.emit('attendance',classId);
  }, 10000)