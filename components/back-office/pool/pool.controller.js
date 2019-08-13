const __ = process.cwd();
const Models = require(`${__}/orm/models/index`);
const layout = 'admin';

const BackOffice_Pool = {};

BackOffice_Pool.viewList = (req, res, next) => {
  Models.Pool.findAll().then(pools => {
    res.render('back-office/pool/pool-list', {
      layout,
      pools,
      title: `Liste des pools`,
      a: { main: 'pools', sub: 'pool-list' },
    });
  });
};

BackOffice_Pool.createPool = (req, res, next) => {
  Models.Pool.create({
    name: req.body.name,
    referent: req.body.referent,
    owner: req.body.owner
  }).then(pool => {
    res.status(200).json({ result: pool, message: 'pool created' });
  }).catch(error => next(new Error(error)));
};

BackOffice_Pool.linkDependencies = (req, res, next) => {
  let dependencies = [];
  Models.Pool.findAll().then( pools =>
  {
    dependencies.push(pools);
    Models.User.findAll({ limit: 250, where: { type: 'candidate' } }).then( users => {
      dependencies.push(users);
      Models.Establishment.findAll().then(es => {
        dependencies.push(es);
        res.status(200).send(dependencies);
      });
    });
  });
};

BackOffice_Pool.viewLinks = (req, res, next) => {
  Models.UserPool.findAll().then(poollinks => {
    res.render('back-office/pool/pool-links', {
      layout,
      poollinks,
      title: `Liste des liaisons de pool`,
      a: { main: 'pools', sub: 'pool-links' },
    });
  });
};

BackOffice_Pool.forceLink = (req, res, next) => {
  Models.UserPool.create({
    pool_id: req.body.pool_id,
    user_id: req.body.user_id,
    establishment: req.body.establishment
  }).then(link => {
    res.status(200).json({ result: link, message: 'link created' });
  }).catch(error => next(new Error(error)));
};

module.exports = BackOffice_Pool;