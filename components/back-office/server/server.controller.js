const __ = process.cwd();
const { validationResult } = require('express-validator');
const { BackError } = require(`${__}/helpers/back.error`);
const Models = require(`${__}/orm/models/index`);

const layout = 'admin';
const fs = require('fs');

const BackOffice_Server = {};

BackOffice_Server.ViewDatabaseDumps = (req, res, next) => {
  let databaseDumps = [];
  fs.readdir('/srv/db_dumps', (err, files) => {
    if (files) files.forEach(file => databaseDumps.push({ stats: fs.statSync('/srv/db_dumps/' + file), name: file }));
    res.render(`back-office/server/db_dumps`, {
      layout, databaseDumps,
      title: 'Liste des sauvegardes de la base de donnée',
      a: { main: 'serverSettings', sub: 'db_dumps' }
    });
  });
};

BackOffice_Server.DownloadDatabaseDumps = (req, res, next) => {
  let path = `/srv/db_dumps/${req.params.name}`;
  fs.access(path, (error) => {
    if (error) return next(new BackError('Sauvegarde introuvable.', 404));
    else res.download(path);
  });
};

BackOffice_Server.RemoveDatabaseDumps = (req, res, next) => {
  let path = `/srv/db_dumps/${req.params.name}`;
  fs.access(path, (error) => {
    if (error) return next(new BackError('Sauvegarde introuvable.', 404));
    else {
      fs.unlinkSync(path);
      return res.status(200).send({ deleted: true });
    }
  });
};

BackOffice_Server.AddMessage = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });
  Models.ServerMessage.create({
    name: req.body.name,
    message: req.body.message,
    msgType: req.body.msgType,
    type: req.body.type,
    fromDate: req.body.fromDate,
    untilDate: req.body.untilDate,
    author: req.user.id
  }).then(message => res.status(201).send(message)).catch(error => next(new BackError(error)));
};

BackOffice_Server.viewMessage = (req, res, next) => {
  Models.ServerMessage.findOne({
    where: { id: req.params.id }
  }).then(message => res.render('back-office/messages/view', { layout, message })).catch(error => next(new BackError(error)));
};

BackOffice_Server.EditMessage = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });
  Models.ServerMessage.update({
    name: req.body.name,
    message: req.body.message,
    msgType: req.body.msgType,
    type: req.body.type,
    fromDate: req.body.fromDate,
    untilDate: req.body.untilDate,
    author: req.user.id
  }, { where: { id: req.params.id } }).then(message => res.status(200).send(message)).catch(error => next(new BackError(error)));
};

BackOffice_Server.RemoveMessage = (req, res, next) => {
  Models.ServerMessage.destroy({
    where: { id: req.params.id }
  }).then(message => res.status(200).send(message)).catch(error => next(new BackError(error)));
};

BackOffice_Server.RenderAddMessage = (req, res, next) => res.render('back-office/messages/add', { layout });

module.exports = BackOffice_Server;