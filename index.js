const express = require('express');
const database = require('./server/database/connection');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const dotenv = require('dotenv');
const path = require('path');
const flash = require('connect-flash');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const http = require('http')
const socketio = require('socket.io');
const attendance = require('./attendance/attendance')
//connection to database
database.connectDB();
database.createStorage();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

dotenv.config( { path : 'config.env'} )
const PORT = process.env.PORT || 8080

app.use(cookieparser('SecretStringForCookie'));
app.use(session({
    secret:'SecretStringForCookie',
    cookie: {maxAge:365*24*60*60*1000},
    resave:true,
    saveUninitialized:true,
}))
app.use(flash());

//log requests
app.use(morgan('tiny'));


app.set('view engine', 'ejs');
// app.use(bodyparser.json());
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended : true,limit:'5mb'}));
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))
app.use('/img', express.static(path.resolve(__dirname, "assets/img")))
app.use('/', require('./server/routes/router'))


io.on('connection',socket=>{
    
    socket.on('joinClass',classId=>{
        socket.join(classId);
        console.log(`id:${socket.id} joined:${classId}`)
    })
    socket.on('attendance', classId=>{
        console.log('attendancs')
        attendance.updateClassTotal(classId);
        socket.broadcast.to(classId).emit('takeAttendance')
    })

    socket.on('givingAttendance',img=>{
        img = img.replace(/data:image\/png;base64,/, "");
        
        console.log(img.slice(0,10));
    })
})




server.listen(PORT,()=>{
    console.log(`running at http://localhost:${PORT}`);
})