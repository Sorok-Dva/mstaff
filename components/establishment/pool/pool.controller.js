const __ = process.cwd();
const { BackError } = require(`${__}/helpers/back.error`);
const crypto = require('crypto');
const fs = require('fs');

const mailer = require(`${__}/bin/mailer`);
const Models = require(`${__}/orm/models/index`);

const Establishment_Pool = {};

Establishment_Pool.View = (req, res, next) => {
  let a = { main: 'pools' };
  Models.Pool.count({ where: { user_id: req.user.id, es_id: req.user.opts.currentEs } }).then(poolsCount => {
    if (poolsCount > 0) {
      return Establishment_Pool.ViewAll(req, res, next);
    } else {
      return res.render('establishments/pool', { a });
    }
  }).catch(error => next(new BackError(error)));
};

Establishment_Pool.ViewAll = (req, res, next) => {
  let a = { main: 'pools' };
  Models.Pool.findAll({ where: { user_id: req.user.id, es_id: req.user.opts.currentEs } }).then(pools => {
    return res.render('establishments/my-pool', { a, pools } );
  }).catch(error => next(new Error(error)));
};

Establishment_Pool.Add = (req, res, next) => {
  let mails = JSON.parse(req.body.mails);
  let full_name = req.user.fullName;
  Models.Pool.create({
    name: req.body.pool,
    referent: req.body.referent,
    user_id: req.user.id,
    es_id: req.user.opts.currentEs
  }).then(pool => {
    mails.forEach(mail => {
      let token = crypto.randomBytes(10).toString('hex');

      Models.InvitationPools.create({
        email: mail,
        token: token,
        pool_id: pool.id
      }).then(() => {
        Models.Establishment.findOne({ where: { id: req.user.opts.currentEs }, attributes: ['name'] }).then((es) => {
          Establishment_Pool.sendMail([ mail ], token, full_name, es.name);
        }).catch(error => next(new Error(error)));
      }).catch(error => next(new Error(error)));
    });

    res.status(200).send({ pool });
  }).catch(error => next(new Error(error)));
};

Establishment_Pool.Edit = (req, res, next) => {
  Models.Pool.findOne({ where: { id: req.body.pool } }).then(pool => {
    pool.name = req.body.name;
    pool.referent = req.body.referent;
    pool.save();
    res.status(200).json('Modifications done')
  }).catch(error => next(new Error(error)));
};

Establishment_Pool.ViewInvitations = (req, res, next) => {
  Models.InvitationPools.findAll({
    attributes: ['email'],
    where: { pool_id: req.params.id },
  }).then(emails => {
    return res.status(200).send({ emails });
  }).catch(error => next(new Error(error)));
};

Establishment_Pool.DeleteInvite = (req, res, next) => {
  Models.InvitationPools.destroy({ where: { pool_id: req.params.id, email: req.body.email } }).then( () => {
    res.status(200).json('Invitation removed from pool');
  }).catch(error => next(new Error(error)));
};

Establishment_Pool.Invite = (req, res, next) => {
  let mails = JSON.parse(req.body.mails);
  let full_name = req.user.fullName;
  mails.forEach(mail => {
    let token = crypto.randomBytes(10).toString('hex');
    Models.InvitationPools.create({
      email: mail,
      token: token,
      pool_id: req.params.id,
    }).then(() => {
      Models.Establishment.findOne({ where: { id: req.user.opts.currentEs }, attributes: ['name'] }).then((es) => {
        Establishment_Pool.sendMail([ mail ], token, full_name, es.name);
      }).catch(error => next(new Error(error)));
    }).catch(error => next(new Error(error)));
  });
  res.status(200).json('Invitations sent');
};

Establishment_Pool.Delete = (req, res, next) => {
  Models.UserPool.destroy({ where: { pool_id: req.body.pool } }).then( () => {
    Models.Pool.findOne({ where: { id: req.body.pool } }).then(pool => {
      pool.destroy().then(res.status(200).json('Pool removed')).catch(error => next(new Error(error)));
    }).catch(error => next(new Error(error)));
  }).catch(error => next(new Error(error)));
};

Establishment_Pool.sendMail = (mails, token, name, es_name) => {
  mails = mails.join();
  mailer.sendEmail({
    to: mails,
    subject: 'Vous avez été invité à rejoindre un pool.',
    template: 'candidate/poolInvite',
    context: {
      token,
      name,
      es_name,
    }
  });
};

Establishment_Pool.ViewVolunteers = (req, res, next) => {
  Models.UserPool.findAll({
    where: { pool_id: req.params.id },
    attributes: { exclude: ['pool_id', 'user_id', 'month_experience', 'createdAt', 'updatedAt'] },
    include: [{
      model: Models.User,
      attributes: { exclude: ['oldId', 'role', 'type', 'key', 'validated', 'opts', 'updatedAt'] },
      required: true,
    }]
  }).then( (users) => {
    return res.status(200).send({ users });
  }).catch(error => next(new Error(error)));
};

Establishment_Pool.viewCandidateDocument = (req, res, next) => {
  Models.UserPool.findOne({ where: { id: req.params.id }, attributes: ['planning'] }).then(result => {
    if (!Object.keys(result.planning).length) {
      return next(new BackError('Document introuvable', 404));
    } else {
      if (fs.existsSync(`./public/uploads/candidates/pools/${result.planning.filename}`)) {
        return res.sendFile(`${__}/public/uploads/candidates/pools/${result.planning.filename}`);
      } else {
        return next(new BackError('Document introuvable sur ce serveur', 404));
      }
    }
  });
};

module.exports = Establishment_Pool;