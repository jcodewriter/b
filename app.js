var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var socketIo = require('socket.io');
var exphbs = require('express-handlebars');

// var hbs = exphbs({
//     helpers: require('./handlers/handlebars'),
//     // defaultLayout: '../index',
//     extname:'.hbs'
// })

const {
  addUser,
  removeUser,
  getUser,
  getPaddleUser,
  getUsersInRoom
} = require('./utils/user');

require('dotenv').config();
var app = express();
const server = require('http').createServer(app);
var io = socketIo(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  helpers: require('./handlers/handlebars'),
  defaultLayout: false,
  extname:'.hbs'
}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/room', roomsRouter);

require('./routes').roomRoute(app, io);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


io.on('connection', async (socket) => {
  socket.on('join', ({ username, room }) => {
    const { error, user } = addUser({ id: socket.id, name: username, room }); // add user with socket id and room info

    if (error) console.log(error);
    
    if (user.length !== 2 ) {
      socket.join(user.room);
  
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room) // get user data based on user's room
      });
    } else {
      socket.join(user[0].room);
      io.to(user[0].room).emit('roomData', {
        room: user[0].room,
        users: user // get user data based on user's room
      });
    }
  });

  socket.on('start', (data) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('start', 'ok');
  });

  socket.on('move', (data) => {
    const user = getPaddleUser(socket.id);
    io.to(user.id).emit('move', data);
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
  
    if (user) {
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
  });
});

module.exports = { app: app, server: server };
