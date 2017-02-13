var io = require('socket.io');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var UUID = require('node-uuid');

app.use('/', express.static(__dirname+'/client'));

// Map Serving & Confirmation
// Request: /maps/MAPNAME/JSON/IMG
// VIP: Fix for injections
app.use('/maps/', function(req, res) {
  let request = req.url.substr(1).split("/");
  console.log(req.url.substr(1));
  if(request.length == 2) {
    let map = request[0];
    let type  = request[1] == "json" ? ".json" : ".png";

console.log("Request for map: "+map+" - "+type);
    // Should check if file exist here
    // Should check if user has permission to file here
    res.sendFile(__dirname+'/maps/'+map+'/'+map+type);
  }
  else {
    console.log("Invalid Request:",request);
  }
})


http.listen(3000, function() {
  console.log("Started listning on port 3000");
});

var sio = io.listen(http);

sio.sockets.on('connection', function (client) {
  //Generate a new UUID, looks something like
  //17629d78-58ec-4c44-8464-9811c1e43da0
  //and store this on their socket/connection
  client.userid = UUID();

  //tell the player they connected, giving them their id
  client.emit('onconnected', { id: client.userid } );

  //Useful to know when someone connects
  console.log('\t socket.io:: player ' + client.userid + ' connected');

  //When this client disconnects
  client.on('disconnect', function () {
    //Useful to know when someone disconnects
    console.log('\t socket.io:: client disconnected ' + client.userid );
  }); //client.on disconnect
}); //sio.sockets.on connection
