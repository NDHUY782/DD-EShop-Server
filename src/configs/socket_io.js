const server = require('../../bin/www')
var { Server } = require('socket.io');
const fs = require('fs');

const io = new Server(server);

let arrUserInfor = {};
fs.readFile('src/public/uploads/arrUser.txt', (err, data) => {
    arrUserInfor = JSON.parse(data);
})

    // socket.io events
    io.on("connection",  (socket) =>{

        socket.on("router", (router) => {
            if (! arrUserInfor[router]) {
                arrUserInfor[router] = [];
            }
            arrUserInfor[router].push(socket.id)

            fs.writeFile('src/public/uploads/arrUser.txt', JSON.stringify(arrUserInfor), err => {
                if (err) {
                  console.error(err);
                }
            }); 

            socket.join(router);

            io.emit('arrUser', arrUserInfor)
        })

        socket.on('sendDiscount', (roomName, code) => { 
            // Emitting the message to all clients in the room
            io.in(roomName).emit('receiveDiscount', code);
        });


        socket.on("disconnect", async () => {

            for (const router in arrUserInfor) {
                var index = arrUserInfor[router].indexOf(socket.id)
                if (index !== -1) {
                    arrUserInfor[router].splice(index, 1);
                }
            }

            fs.writeFile('src/public/uploads/arrUser.txt', JSON.stringify(arrUserInfor), err => {
                if (err) {
                  console.error(err);
                }
            }); 

            io.emit('arrUser', arrUserInfor)
        })

    });

module.exports = io