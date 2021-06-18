const url = require('url');
const { getRooms } = require('../utils/user');

module.exports = function (app, io) {
  app.get('/', (req, res, next) => {
    res.render('index', {title: 'PingPong', gameId: (new Date()).valueOf()})
  });
  app.get('/single', (req, res, next) => {
    res.render('./single-game', {title: 'PingPong'})
  });
  app.get('/rooms', (req, res, next) => {
    const rooms = getRooms();
    res.render('./room', {title: 'PingPong', rooms})
  });
  app.get('/multi/room', (req, res, next) => {
    const queryObject = url.parse(req.url,true).query;
    res.render('multi-game', {title: 'PingPong', name: queryObject.name, creator: 'y', limit: process.env.POINTS_LIMIT})
  });
  app.get('/multi/join', (req, res, next) => {
    const queryObject = url.parse(req.url,true).query;
    res.render('multi-game', {title: 'PingPong', name: queryObject.name, creator: 'n', limit: process.env.POINTS_LIMIT})
  });
};
