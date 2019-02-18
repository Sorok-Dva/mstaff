const { check, validationResult } = require('express-validator/check');
const { Op, Sequelize } = require('sequelize');

const sequelize = require('../bin/sequelize');
const Models = require('../models/index');

module.exports = {
  /**
   * validate MiddleWare
   * @param method
   * @description Form Validator. Each form validation must be created in new case.
   */
  validate: (method) => {
    switch (method) {
      case 'create': {
        return [
          check('email').isEmail(),
          check('firstName').exists(),
          check('lastName').exists()
        ]
      }
    }
  },
  getNeeds: (req, res, next) => {
    res.render('establishments/needs');
  },
  addNeed: (req, res, next) => {
    let render = { a: { main: 'needs' } };
    Models.Post.findAll().then(posts => {
      render.posts = posts;
      return res.render('establishments/addNeed', render);
    }).catch(error => next(new Error(error)));
  },
  /**
   * Create User Method
   * @param req
   * @param res
   * @description Method triggered on new user form submit.
   *              Verify form consistency, generate password hash and execute query.
   */
  create: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('users/registerDemo', { body: req.body, errors: errors.array() });
    }

    Models.User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      type: 'es'
    }).then(user => res.render('users/login', { user }))
      .catch(error => res.render('users/register', { body: req.body, sequelizeError: error }));
  },
  findByGeo: (req, res, next) => {
    let { rayon, lat, lon, filterQuery } = req.body;
    let formule = `(6366*acos(cos(radians(${lat}))*cos(radians(lat))*cos(radians(lon) -radians(${lon}))+sin(radians(${lat}))*sin(radians(lat))))`;
    let sql = `SELECT * FROM EstablishmentReferences WHERE ${formule} <= ${rayon}`;
    sequelize.query(sql, { type: sequelize.QueryTypes.SELECT }).then((data) => {
      let ids = [];
      for (let k in data) {
        ids.push(data[k].finess_et);
      }
      let filter = {
        where: {
          finess_et: ids
        },
        limit: 5000
      };
      if (filterQuery) filter.where.cat = filterQuery;
      Models.EstablishmentReference.findAll(filter).then((es) => {
        return res.status(200).json(es);
      });
    });
  },
  addApplication: (body, wish) => {
    for (let i = 0; i < body.es.length; i++) {
      Models.Application.create({
        name: body.name || 'Candidature sans nom',
        wish_id: wish.id,
        candidate_id: body.user.id,
        finess: body.es[i],
        new: true
      });
    }
  },
  apiSearchCandidates: (req, res, next) => {
    console.log(req.body);
    Models.Establishment.findOne({
      where: { id: req.params.id },
      include: {
        model: Models.ESAccount,
        where: { user_id: req.user.id }
      }
    }).then(es => {
      if (!es) return res.status(403).send(`You don't have access to this establishment.`);
      Models.Application.findAll({
        where: { ref_es_id: es.finess },
        include: {
          model: Models.Wish,
          on: {
            '$Application.wish_id$': {
              [Op.col]: 'Wish.id'
            }
          },
          where: {
            [Op.and]: [
              { contract_type: req.body.contractType },
              Sequelize.where(Sequelize.fn('lower', Sequelize.col('posts')), {
                [Op.like]: `%${req.body.post}%`
              })
            ]
          },
          include: {
            model: Models.Candidate,
            attributes: { exclude: ['updatedAt', 'createdAt'] },
            where: { is_available: true },
            required: true,
            include: {
              model: Models.User,
              attributes: { exclude: ['password', 'type', 'role', 'updatedAt', 'createdAt'] },
              on: {
                '$Wish->Candidate.user_id$': {
                  [Op.col]: 'Wish->Candidate->User.id'
                }
              },
              required: true
            }
          }
        }
      }).then(applications => {
        return res.status(200).send(applications);
      });
    });
  }
};
