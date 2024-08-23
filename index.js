const express =require('express')
const http =require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT =3000;

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('location',(data)=>{
        io.emit('receive-loc',{id:socket.id,...data})
    })
    socket.on('disconnect', () => {
      console.log('user disconnected');
      io.emit('user-disconnect',socket.id)
    });
  });
app.get('/', (req,res)=>{
    res.render('index');
});


server.listen(PORT, ()=>{
    console.log(`server is ${PORT}`);
});