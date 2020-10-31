var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
    // path: '/test',
    // serveClient: false,
    // below are engine.IO options
    // pingInterval: 10000,
    pingInterval: 10000,
    pingTimeout: 20000,
    cookie: false,
    transports: [ 'polling','websocket'],
    wsEngine: ws
  });
var ws = require('express-ws')(app);
// var five = require("johnny-five");
// var Raspi = require("raspi-io").RaspiIO;
// var board = new five.Board({
//   io: new Raspi()
// });

// var moment = require('moment')

// // const express = require('express')
// // const app = express()
// // const port = 3000
// var cors = require('cors');
// const { setInterval, setTimeout } = require('timers');
// app.use(cors())

// var geoip = require('geoip-lite');



// board.on("ready", function() {

//     var led1 = new five.Led("P1-11");
//     var led2 = new five.Led("P1-13");
//     var led3 = new five.Led("P1-15");
//     var led4 = new five.Led("P1-37");

//     // led1.on() 
//     // led1.on()
//     led1.on()
//     led2.on()
//     led3.on()
//     led4.on()

//     let users = 0;




    let users = 0;
    let clients = []
    // io(http, {pingTimeout: 60000})
    io.on('connection', (socket) => {

        users++
        console.log('a user connected', users);

        // _id = socket.id
        // setInterval(() => {
        //     socket.emit("server-get");
        // }, 100);
        clients.push({
            _id: socket.id,
        })
        

        socket.broadcast.emit('agregarJugador', socket.id)
        

        app.get('/llamada', (req, res) => {
            // console.log('Users:', users)
            // res.sendFile(__dirname + '/index.html');
            // socket.emit("server-handshake", "asd"); 
            // socket.emit("server-handshake", "My string", 42, { myMember : "My member string" });
            socket.emit("otherScript");
            res.send('llamada')
            
        })

        socket.on("MOVE", (x, z) => {
            // console.log('ID', socket.id);
            // console.log('MOVE', x, z);


            for (let index = 0; index < clients.length; index++) {
                if(clients[index]._id == socket.id){
                    clients[index].x = x;
                    clients[index].z = z;
                    console.log(clients)
                }
            }

            socket.broadcast.emit('move-client', socket.id, x, z);
            // socket.broadcast.emit('move-client', socket.id, x, z);

        });
        socket.on("test-event", () => {
            console.log('some=event')
            // console.log(arg0); //output: "optional event data"
            // acknowledge("optional acknowledgement data");
        });

        socket.on("client-position", (x, z) => {
            // console.log('socket', socket)
            // console.log("x", x);
            // console.log("z", z);

            clients.push({
                _id: socket.id,
                position: [x, z]
            })
    
            // console.log('clients', clients)

            // socket.broadcast.emit('broadcast', x, z);

          
            
            // socket.emit("server-handshake");
            // console.log("Sent server handshake");
        });
    
        app.ws('/', (s, req) => {
            console.error('websocket connection');
            for (var t = 0; t < 3; t++)
              setTimeout(() => s.send('message from server', ()=>{}), 1000*t);
        });



        socket.on('disconnect', () => {
            for (let index = 0; index < clients.length; index++) {
                if(clients[index]._id == socket.id){
                    clients.shift(clients[index]);
                }
            }
            socket.emit('disconnectClient', socket.id);
            users--
            console.log('user disconnected');
        });

           

        // socket.on("client-handshake", () => {
        //     console.log("Received client handshake");
            
        //     socket.emit("server-handshake");
        //     console.log("Sent server handshake");
        // });
        // socket.on("vuelve", (data) => {
        //     console.log("volvio", data);
            
        //     // socket.emit("server-handshake");
        //     // console.log("Sent server handshake");
        // });


        // socket.on('regarOn', (segundos) => {
            
        // });
        // socket.on('regarOff', (milesimas) => {
            
        // });
    });
      

      
//     // var ip = "45.189.79.2";
//     // var geo = geoip.lookup(ip);

//     // var led1 = new five.Led("P1-17");

//     app.get('/apagar', (req, res) => {
// // 
//         led1.on() 
//         led2.on()
//         led3.on()
//         led4.on()
//     })
//     app.get('/encender', (req, res) => {

//         led1.off()
//         led2.off()
//         led3.off()
//         led4.off()
//     })
//     // app.get('/frenar', (req, res) => {
//     //     res.send('Frenar')
//     //     motorAtras2.on();
//     //     motorAtras1.on();
//     // })

//     // app.listen(port, () => {
//     //     console.log(`Example app listening at http://localhost:${port}`)
//     // })
    


// });

http.listen(3000, () => {
    console.log('listening on *:3000');
  });