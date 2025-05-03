const {Server} = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors: {
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }
})

const userSocketMap = {};


const getReceiverSocketId=(receiverId)=>{
    return userSocketMap[receiverId];
}


io.on('connection', (socket) => {

    const  userId = socket.handshake.query.userId;
    if (userId !== 'undefined') userSocketMap[userId]=socket.id
})

module.exports = {io,app,server,getReceiverSocketId};