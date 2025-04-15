const express = require('express')
const http = require('http')
const cors = require('cors')
const {Server} = require('socket.io')


const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json())

const io = new Server(server)

const userSocketMap = {};

/*
io.sockets.adapter.rooms
What it is: A Map object that contains all active rooms and their members.
Structure:
Key: Room name (a String).
Value: A Set of socket IDs in that room.
*/


const getAllClientsByRoomId = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
              };
        }
    )
}
io.on('connection', (socket) => {
    socket.on('join', ({roomId, username})=> {
        socket.join(roomId);
        userSocketMap[socket.id] = username;

        const clients = getAllClientsByRoomId(roomId);
        
        clients.array.forEach(socketId => {
            io.to(roomId).emit('joined',{
                clients,
                roomId,
                socketId: socket.id,
            })
        });
    })

    /*
    socket.in() is a Socket.IO method used to target all sockets in a specific room, 
    excluding the socket that makes the call. It is typically used for broadcasting 
    messages to everyone in the room except the sender.
    */

    socket.on('codeChange', ({roomId, code}) => {
        socket.in(roomId).emit('codeChange', {code});
    })

    socket.on('codesync', ({socketId, code}) => {
        io.to(socketId).emit('codesync', { code });
    })


    socket.on("disconnecting", () => {
        const rooms = [...socket.rooms];
        // leave all the room
        rooms.forEach((roomId) => {
          socket.in(roomId).emit('disconnected', {
            socketId: socket.id,
            username: userSocketMap[socket.id],
          });
        });
    
        delete userSocketMap[socket.id];
        socket.leave();
    })
})

app.listen(8000, ()=> {
    console.log('server running')
})