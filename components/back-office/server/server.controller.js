const __ = process.cwd();
const { BackError } = require(`${__}/helpers/back.error`);
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

module.exports = BackOffice_Server;