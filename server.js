var PORT = process.env.PORT || 8081;
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


server.listen(PORT, () => {
    console.log(`Listening on ${server.address().port}`);
})


io.on('connection', client => {
    console.log("here")
    io.emit('test', 'a message')
})