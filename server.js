var express          = require('express');
var path             = require('path');
var https            = require('https');
var fs 			     = require('fs');
var port             = process.env.PORT || 5001;
var passport         = require('passport');
var cookieParser     = require('cookie-parser');
var bodyParser       = require('body-parser');
var session          = require('express-session');
var SinglyLinkedList = require('./server/config/sll.js');
var app              = express();


// setup for express application
app.use(express.static(path.join(__dirname, './client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
// app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch',
                  resave: true,
                  saveUninitialized: true })); //session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

require('./server/config/mongoose.js');
require('./server/config/passport.js')(passport); //pass passport for configuration

//  require Notie
app.use('/notie', express.static(__dirname + '/node_modules/notie'));

var routes_setter = require('./server/config/routes.js');
routes_setter(app, passport, session); //load our routes and pass in our app and fully configured passport.

var options = {
    key: fs.readFileSync('certs/key.pem'),
    cert: fs.readFileSync('certs/cert.pem')
};

var httpsServer = https.createServer(options, app);

var server = httpsServer.listen(port, function() {console.log('this should work')});

// SOCKET CONNECTION //
var users_online = new SinglyLinkedList;

var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket) {
    console.log("We are using sockets");
    console.log(socket.id);
    console.log("----------------------------");
    // console.log(users_online);
    console.log("----------------------------");
    socket.on("logging-in", function(data) {
        users_online.insert(data, socket.id)
        console.log("hello", users_online);
    });

    socket.on("refreshing", function(data) {
        var you = users_online.refresh(data, socket.id);
        if (you)
            you._id = you.user;
        console.log("refreshed you", you);
        io.to(socket.id).emit("refreshed", you);
    });

    socket.on("logout", function(data) {
        users_online.remove(socket.id);
        console.log("logout", users_online);
        io.sockets.emit("users-online", users_online);
    });

    socket.on("requestCall", function(data) {
        console.log("request", data)
        var host = users_online.findSocket(data.hostId);
        var friend = users_online.findSocket(data.receptionSocket);
        console.log("host", host)
        console.log("friend", friend)
        socket.broadcast.to(friend).emit("requestingCall", {"donorSocket": host, "donorName": data.hostName});
    });

    socket.on("callAccepted", function(data) {
        console.log("***********ACCEPTED*************", data);
        socket.broadcast.to(data.donorSocket).emit("callAccepted", {"chatroomID": data.chatroomID});
    });

    socket.broadcast.on("callDeclined", function(data) {
        console.log("***********DECLINE*************", data);
        socket.broadcast.to(data.donorSocket).emit("callDeclined");
    });

    socket.on('disconnect', function() {
        console.log("Bye Bye Socket:", socket.id);
    })
})


