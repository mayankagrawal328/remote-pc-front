var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const fs = require('fs');
const zipLocal = require("zip-local")

app.get('/view', (req, res) => {
    res.sendFile(__dirname + '/display.html');
})


io.on('connection', (socket)=> {

    socket.on("join-message", (roomId) => {
        socket.join(roomId);
        console.log("User joined in a room : " + roomId);
    })

    socket.on("screen-data", function(data) {
        
        data = JSON.parse(data);
        var room = data.room;
        var imgStr = data.image;
        socket.broadcast.to(room).emit('screen-data', imgStr);
    })
    socket.on("files-shear", function(data) {
        
        data = JSON.parse(data);
        var room = data.room;
        var base64file = data.file;
        console.log(base64file);
        socket.broadcast.to(room).emit('files-shear', base64file);
    })

    socket.on('files', data => {
        data = JSON.parse(data);
        data.fileDataArray.forEach(fileData => {
            fs.writeFileSync(`uploads/${fileData.name}`, fileData.content, 'base64');
            console.log(`Received file: ${fileData.name}`);
        });
 
         base64data = zipLocal.sync.zip("uploads").compress().memory().toString('base64');
         var room = data.room;
         obj={room:room, file:base64data}
         socket.broadcast.to(room).emit("files-shear1", JSON.stringify(obj));

    });

    // socket.on("mouse-click", function(data) {
    //     var room = JSON.parse(data).room;
    //     socket.broadcast.to(room).emit("mouse-click", data);
    // })

    socket.on("type", function(data) {
        var room = JSON.parse(data).room;
        socket.broadcast.to(room).emit("type", data);
        console.log("type")
    })

    socket.on("key-up", function(data) {
        var room = JSON.parse(data).room;
        socket.broadcast.to(room).emit("key-up", data);
    })

    socket.on("key-down", function(data) {
        var room = JSON.parse(data).room;
        socket.broadcast.to(room).emit("key-down", data);
    })        
    ///
    socket.on("mouse-down", function(data) {
        var room = JSON.parse(data).room;
        socket.broadcast.to(room).emit("mouse-down", data);
    })
    socket.on("mouse-up", function(data) {
        var room = JSON.parse(data).room;
        socket.broadcast.to(room).emit("mouse-up", data);
    })
    socket.on("mouse-click", function(data) {
        var room = JSON.parse(data).room;
        socket.broadcast.to(room).emit("mouse-click", data);
    })

    socket.on("mouse-r-click", function(data) {
        var room = JSON.parse(data).room;
        socket.broadcast.to(room).emit("mouse-r-click", data);
    })

    socket.on("mouse-move", function(data) {
        var room = JSON.parse(data).room;
        console.log("m")
        socket.broadcast.to(room).emit("mouse-move", data);
    })
})








var server_port = process.env.YOUR_PORT || process.env.PORT || 8000;
http.listen(server_port, function() {
    console.log( 'listening on *:' + server_port );
});
