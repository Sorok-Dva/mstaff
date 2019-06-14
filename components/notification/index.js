const Candidate = require('./candidate/notification_candidate.controller');
const ES = require('./es/notification_es.controller');
const Main = require('./notification.controller');

module.exports = {
  Candidate,
  ES,
  Main
};