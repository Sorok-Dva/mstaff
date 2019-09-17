const __ = process.cwd();
const _ = require('lodash');
const fs = require('fs');
const { validationResult } = require('express-validator');
const { Sequelize, Op } = require('sequelize');
const { BackError } = require(`${__}/helpers/back.error`);
const httpStatus = require('http-status');
const crypto = require('crypto');
const moment = require('moment');
const gmap = require(__ + '/helpers/google-map-api');

const mailer = require(`${__}/bin/mailer`);
const Models = require(`${__}/orm/models/index`);
const layout = 'admin';

const BackOffice_Establishment = {};

BackOffice_Establishment.create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

  let form_data = {
    name: req.body.name,
    finess_et: req.body.finess_et,
    finess_ej: req.body.finess_ej,
    siret: req.body.siret,
    phone: req.body.phone,
    user_address: req.body.user_address,
    sector: req.body.sector,
    salaries_count: req.body.salaries_count,
    contact_identity: req.body.contactIdentity,
    contact_post: req.body.contactPost,
    contact_email: req.body.contactEmail,
    contact_phone: req.body.contactPhone,
    domain_enable: parseInt(req.body.domain_enable),
    domain_name: req.body.domain_name,
    logo: req.body.logo,
    banner: req.body.banner
  };



  gmap.getAddress(req.body.user_address, false)
    .then(results => {
      return res.status(200).json({
        status: 'OK',
        form_data: form_data,
        results: results
      });
    })
    .catch(error => {
      return res.status(200).json({ status: error.status, error: error });
    });

};

BackOffice_Establishment.validateCreate = (req, res, next) => {

  let form_data = {
    name: req.body.form_data.name,
    finess_ej: req.body.form_data.finess_ej,
    siret: req.body.form_data.siret,
    phone: req.body.form_data.phone,
    sector: req.body.form_data.sector,
    salaries_count: parseInt(req.body.form_data.salaries_count),
    contact_identity: req.body.form_data.contact_identity,
    contact_post: req.body.form_data.contact_post,
    contact_email: req.body.form_data.contact_email,
    contact_phone: req.body.form_data.contact_phone,
    domain_enable: parseInt(req.body.form_data.domain_enable),
    domain_name: req.body.form_data.domain_name,
    logo: req.body.form_data.logo,
    banner: req.body.form_data.banner,
    user_address: req.body.form_data.user_address,
    formatted_address: req.body.formatted_address,
    street_number: req.body.address.street_number,
    street_name: req.body.address.street_name,
    city: req.body.address.city,
    department: req.body.address.department,
    region: req.body.address.region,
    country: req.body.address.country,
    postal_code: req.body.address.postal_code,
    lat: req.body.location.lat,
    lng: req.body.location.lng,
    location_updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
  };

  try {
    Models.Establishment.findOrCreate({
      where: { finess: req.body.form_data.finess_et },
      defaults: form_data
    })
      .spread((es, created) => {
        if (created) {
          if (!_.isNil(es.domain_name)) {
            Models.Subdomain.findOrCreate({
              where: { name: es.domain_name },
              defaults: {
                enable: parseInt(req.body.form_data.domain_enable),
                es_id: es.id
              }
            })
              .spread((subdomain, subCreated) => {
                if (!subCreated) {
                  req.flash('error_msg', `Ce sous domaine est déjà utilisé.`);
                  es.domain_name = null;
                  es.domain_enable = false;
                  es.save();
                }

                Models.EstablishmentReference.findOne({
                  where: { finess_et: es.finess }
                })
                  .then(ref => {
                    ref.es_id = es.id;
                    ref.save();
                    return res.status(200).json({ status: 'Created', es });
                  })
                  .catch(errors => next(new BackError(errors)));
              });
          }
        } else {
          return res.status(200).json({ status: 'Already exists', es });
        }
      });
  } catch (errors) {
    return next(new BackError(errors));
  }

};

BackOffice_Establishment.View = (req, res, next) => {
  Models.Establishment.findOne({
    where: { id: req.params.id },
    include: [{
      model: Models.ESAccount,
      where: { es_id: req.params.id },
      required: false,
      include: {
        model: Models.User,
        on: {
          '$ESAccounts.user_id$': {
            [Op.col]: 'ESAccounts->User.id'
          }
        },
      }
    }, {
      model: Models.EstablishmentReference,
      on: {
        '$Establishment.finess$': {
          [Op.col]: 'ref.finess_et'
        }
      },
      as: 'ref',
      required: true,
    }]
  }).then(data => {
    if (_.isNil(data)) {
      req.flash('error_msg', 'Cet établissement n\'existe pas.');
      return res.redirect('/back-office/es');
    }
    Models.Candidate.findAll({
      include: [{
        model: Models.Application,
        as: 'applications',
        required: true,
        where: {
          ref_es_id: data.dataValues.finess
        },
      }]
    }).then(candidates => {
      res.render('back-office/es/show', {
        layout,
        candidates,
        title: `Établissement ${data.dataValues.name}`,
        a: { main: 'es', sub: 'es_one' },
        es: data
      })
    });
  }).catch(error => next(new BackError(error)));
};

BackOffice_Establishment.Edit = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

  try {
    Models.Establishment.findOne({ where: { id: req.params.id } }).then((es) => {
      if (_.isNil(es)) return next();
      Models.EstablishmentReference.findOne({ where: { finess_et: es.finess } }).then(esRef => {
        if (!_.isNil(es.domain_name)) {
          Models.Subdomain.findOne({ where: { es_id: es.id } }).then(esSubdomain => {
            Models.Subdomain.findOne({ where: { name: req.body.domain_name } }).then(subCheck => {
              let subESExist = !_.isNil(esSubdomain);
              let subCheckOk = false;
              if (!_.isNil(subCheck) && subESExist) {
                if (esSubdomain.es_id !== subCheck.es_id) {
                  req.flash('error_msg', `Ce sous domaine est déjà utilisé.`);
                  req.body.domaine_name = esSubdomain.domain_name;
                }
                else subCheckOk = true
              } else subCheckOk = true;

              let update = {
                name: req.body.name,
                category: req.body.category,
                finess_ej: req.body.finess_ej,
                siret: req.body.siret,
                phone: req.body.phone,
                address: req.body.address,
                town: req.body.addr_town,
                sector: req.body.sector,
                salaries_count: req.body.salaries_count,
                contact_identity: req.body.contactIdentity,
                contact_post: req.body.contactPost,
                contact_email: req.body.contactEmail,
                contact_phone: req.body.contactPhone,
                domain_enable: parseInt(req.body.domain_enable),
                domain_name: req.body.domain_name,
              };
              if (req.uploads && req.uploads.logo){
                update.logo = req.uploads.logo.dir.replace('public', '') + '/' + req.uploads.logo.name;
                if (fs.existsSync('public' + es.logo)){
                  fs.unlinkSync('public' + es.logo)
                }
              }
              if (req.uploads && req.uploads.banner){
                update.banner = req.uploads.banner.dir.replace('public', '') + '/' + req.uploads.banner.name;
                if (fs.existsSync('public' + es.banner)){
                  fs.unlinkSync('public' + es.banner)
                }
              }

              es.update(update).then(savedEs => {
                if (subCheckOk) {
                  if (subESExist) {
                    esSubdomain.update({
                      name: savedEs.domain_name,
                      enable: savedEs.domain_enable
                    }).catch(error => next(new BackError(error)));
                  } else {
                    Models.Subdomain.create({
                      name: savedEs.domain_name,
                      enable: savedEs.domain_enable,
                      es_id: savedEs.id
                    })
                  }
                  req.flash('success_msg', 'Établissement mis à jour.');
                  return res.redirect(`/back-office/es/${savedEs.id}`);
                } else {
                  req.flash('success_msg', 'Établissement mis à jour.');
                  return res.redirect(`/back-office/es/${savedEs.id}`);
                }
              });
            })
          })
        }
      });
    })
  } catch (errors) {
    return next(new BackError(errors));
  }
};

BackOffice_Establishment.EditLocation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

  try {
    Models.Establishment.findOne({ where: { id: req.params.id } })
      .then((establishment) => {
        if (_.isNil(establishment)) return next();
        for (const addressKey in req.body.address) {
          establishment[addressKey] = req.body.address[addressKey];
        }
        for (const locationKey in req.body.location) {
          establishment[locationKey] = req.body.location[locationKey];
        }
        establishment.user_address = req.body.form_data.user_address;
        establishment.formatted_address = req.body.formatted_address;
        establishment.location_updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        establishment.save();
      });
  } catch (error) {
    return next(new BackError(error));
  }

  req.flash('success_msg', 'Établissement mis à jour.');
  return res.status(200).send();

};

BackOffice_Establishment.getRefList = (req, res, next) => {
  let where = _.isNil(req.query.search) ? null : {
    [Op.or]: [{
      name: Sequelize.where(Sequelize.fn('lower', Sequelize.col('name')), {
        [Op.like]: `%${req.query.search.toLowerCase()}%`
      })
    }, {
      finess_et: Sequelize.where(Sequelize.fn('lower', Sequelize.col('finess_et')), {
        [Op.like]: `%${req.query.search.toLowerCase()}%`
      })
    }, {
      address_town: Sequelize.where(Sequelize.fn('lower', Sequelize.col('address_town')), {
        [Op.like]: `%${req.query.search.toLowerCase()}%`
      })
    }],
  };
  Models.EstablishmentReference.findAll({ attributes: ['id'], where }).then(allEs => {
    Models.EstablishmentReference.findAll({
      where,
      attributes: [
        'id', 'name', 'finess_et', 'address_dpt_name', 'address_town',
        [Sequelize.literal(
          '(SELECT COUNT(*) FROM Applications WHERE `EstablishmentReference`.`finess_et` = `Applications`.`ref_es_id`)'
        ), 'applications']
      ],
      offset: _.isNaN(req.query.offset) ? 0 : parseInt(req.query.offset),
      limit: _.isNaN(req.query.limit) ? 100 : parseInt(req.query.limit),
      order: [[
        _.isNil(req.query.sort) ? 'id' : req.query.sort === 'applications' ? Sequelize.literal('applications') : req.query.sort,
        req.query.order
      ]]
    }).then(data => {
      res.status(200).send({ total: allEs.length, rows: data });
    }).catch(error => next(new BackError(error)));
  }).catch(error => next(new BackError(error)));
};

BackOffice_Establishment.getRefInfo = (req, res, next) => {
  Models.EstablishmentReference.findOne({
    where: { id: req.params.id },
    include: {
      model: Models.Application,
      include: [{
        model: Models.Wish,
        required: true,
        on: {
          '$Applications.wish_id$': {
            [Op.col]: 'Applications->Wish.id'
          }
        },
        include: {
          model: Models.Candidate,
          attributes: { exclude: ['updatedAt', 'createdAt'] },
          required: true,
          include: [{
            model: Models.User,
            attributes: { exclude: ['password', 'type', 'role', 'email', 'phone', 'updatedAt', 'createdAt'] },
            on: {
              '$Applications->Wish->Candidate.user_id$': {
                [Op.col]: 'Applications->Wish->Candidate->User.id'
              }
            },
            required: true
          }]
        }
      }]
    }
  }).then(es => {
    if (_.isNil(es)) return next(new BackError(`Establishment ${req.params.id} not found`, httpStatus.NOT_FOUND));
    return res.status(200).send(es);
  }).catch(error => next(new BackError(error)));
};

BackOffice_Establishment.getRefInfoToCreate = (req, res, next) => {
  let transporter;
  Models.EstablishmentReference.findOne({
    where: { id: req.params.id },
  }).then(es => {
    if (_.isNil(es)) return next(new BackError(`Establishment ${req.params.id} not found`, httpStatus.NOT_FOUND));
    transporter = es;
    return Models.Establishment.findOne({ where: { finess: es.finess_et } });
  }).then(mstaffEs => {
    if (!_.isNil(mstaffEs))
      return next(new BackError(`Establishment with finess ${transporter.finess_et} already added in Mstaff.`, httpStatus.CONFLICT));
    return res.status(200).send(transporter);
  }).catch(error => next(new BackError(error)));
};

BackOffice_Establishment.addUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

  try {
    Models.User.findOrCreate({
      where: { email: req.body.email },
      attributes: ['firstName', 'lastName', 'type', 'id'],
      defaults: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        password: 'TODEFINE',
        birthday: '1900-01-01 23:00:00',
        postal_code: '-',
        town: '-',
        type: 'es',
        key: crypto.randomBytes(20).toString('hex')
      }
    }).spread((user, created) => {
      if (!created && user.type !== 'es') return res.status(200).json({ status: 'Not an ES account', user });
      Models.ESAccount.findOrCreate({
        where: {
          user_id: user.id,
          es_id: req.params.id
        },
        defaults: {
          role: req.body.role,
        }
      }).spread((esaccount, esCreated) => {
        if (created) {
          mailer.sendEmail({
            to: user.email,
            subject: 'Bienvenue sur Mstaff !',
            template: 'es/new_user',
            context: { user }
          });
          return res.status(201).json({ status: 'Created and added to es', user, esaccount });
        } else {
          if (esCreated) return res.status(201).json({ status: 'Added to es', user, esaccount });
          return res.status(200).json({ status: 'Already exists', user, esaccount });
        }
      });
    });
  } catch (errors) {
    return next(new BackError(errors));
  }
};

BackOffice_Establishment.editUserRole = (req, res, next) => {
  Models.User.findOne({
    where: { id: req.params.userId },
    attributes: ['id', 'firstName', 'lastName'],
    include: {
      model: Models.ESAccount,
      required: true,
      where: {
        user_id: req.params.userId,
        es_id: req.params.id
      }
    }
  }).then(esAccount => {
    esAccount.ESAccounts[0].role = req.body.newRole;
    esAccount.ESAccounts[0].save().then(newResult => {
      return res.status(200).send(newResult);
    });
  }).catch(errors => next(new BackError(errors)));
};

BackOffice_Establishment.removeUser = (req, res, next) => {
  Models.User.findOne({
    where: { id: req.params.userId },
    attributes: ['id', 'firstName', 'lastName'],
    include: {
      model: Models.ESAccount,
      required: true,
      where: {
        user_id: req.params.userId,
        es_id: req.params.id
      }
    }
  }).then(esAccount => {
    esAccount.ESAccounts[0].destroy().then(destroyedESAccount => {
      return res.status(200).send(destroyedESAccount);
    }).catch(errors => next(new BackError(errors)));
  }).catch(errors => next(new BackError(errors)));
};

BackOffice_Establishment.getNeeds = (req, res, next) => {
  Models.Need.findAll({
    where: { es_id: req.params.esId },
    include: [{
      model: Models.NeedCandidate,
      as: 'candidates',
      required: true,
      include: {
        model: Models.Candidate,
        required: true,
        include: {
          model: Models.User,
          attributes: ['id', 'firstName', 'lastName', 'birthday'],
          on: {
            '$candidates->Candidate.user_id$': {
              [Op.col]: 'candidates->Candidate->User.id'
            }
          },
          required: true
        }
      }
    }, {
      model: Models.Establishment,
      required: true
    }]
  }).then(need => {
    if (_.isNil(need)) return next(new BackError(`Need ${req.params.id} not found`, httpStatus.NOT_FOUND));
    return res.status(200).send(need);
  }).catch(error => next(new BackError(error)));
};

BackOffice_Establishment.getNeed = (req, res, next) => {
  Models.Need.findOne({
    where: { id: req.params.id },
    include: [{
      model: Models.NeedCandidate,
      as: 'candidates',
      required: true,
      include: {
        model: Models.Candidate,
        required: true,
        include: {
          model: Models.User,
          attributes: ['id', 'firstName', 'lastName', 'birthday'],
          on: {
            '$candidates->Candidate.user_id$': {
              [Op.col]: 'candidates->Candidate->User.id'
            }
          },
          required: true
        }
      }
    }, {
      model: Models.Establishment,
      required: true
    }]
  }).then(need => {
    if (_.isNil(need)) return next(new BackError(`Need ${req.params.id} not found`, httpStatus.NOT_FOUND));
    return res.status(200).send(need);
  }).catch(error => next(new BackError(error)));
};

BackOffice_Establishment.ViewList = (req, res, next) => {
  Models.Establishment.findAll({
    attributes: [
      'id', 'name', 'finess', 'sector', 'status', 'domain_enable', 'domain_name',
      [Sequelize.literal(
        '(SELECT COUNT(id) FROM Applications WHERE `Establishment`.`finess` = `Applications`.`ref_es_id`)'), 'applications']],
    include: [{
      model: Models.Need,
      attributes: ['id'],
      required: false
    }, {
      model: Models.ESAccount,
      attributes: ['id'],
      required: false
    }]
  }).then(data => {
    res.render('back-office/es/list', {
      layout,
      title: 'Liste des Établissements Mstaff',
      a: { main: 'es', sub: 'es_all' },
      data
    })
  }).catch(error => next(new BackError(error)));
};

BackOffice_Establishment.ViewRefList = (req, res, next) => {
  res.render('back-office/es/list_ref', {
    layout,
    title: 'Liste des Établissements dans le référentiel',
    a: { main: 'references', sub: 'establishments' }
  });
};

BackOffice_Establishment.getEsLinksList = (req, res, next) => {
  Models.EstablishmentGroups.findAll({ where: { id_group: req.params.id } }).then(linkes => {
    res.status(200).send({ linkes });
  }).catch(error => next(new BackError(error)));
};

BackOffice_Establishment.getEstablishmentList = (req, res, next) => {
  Models.Establishment.findAll().then(establishments => {
    res.status(200).send({ establishments });
  }).catch(error => next(new BackError(error)));
};

BackOffice_Establishment.bulkUpdateESLocation = (req, res, next) => {
  if (!req.body.date)
    return next(new BackError('Invalid date'));

  let date = moment(req.body.date);

  if (!date.isValid())
    return next(new BackError('Invalid date'));

  let where_location_updatedAt = null;
  if (req.body.update_nulls === 'true') {
    where_location_updatedAt = {
      [Op.or]: [
        {
          [Op.lte]: date.format('YYYY-MM-DD HH:mm:ss')
        },
        null
      ]
    };
  } else {
    where_location_updatedAt = {
      [Op.and]: [
        {
          [Op.lte]: date.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          [Op.ne]: null
        }
      ]
    };
  }


  Models.Establishment.findAll({
    where: {
      location_updatedAt: where_location_updatedAt
    },
    include: {
      model: Models.EstablishmentReference,
      as: 'ref',
      on: {
        '$Establishment.finess$': {
          [Op.col]: 'ref.finess_et'
        },
      }
    }
  })
    .then((establishments) => {

      let operations = [];
      let promises = [];
      let to = 0;

      for (let i = 0; i < establishments.length; i++){
        const establishment = establishments[i];

        let operation = {
          status: 'UNEXPECTED_ERROR',
          establishment: establishment
        };
        operations.push(operation);

        let address = '';
        if (establishment.user_address){
          address = establishment.user_address;
        } else {
          if (!establishment.ref){
            operation.status = 'MISSING_ESTABLISHMENT_REFERENCE_ERROR';
            continue;
          }

          address += establishment.ref.address_num ? establishment.ref.address_num + ' ' : '';
          address += establishment.ref.address_type ? establishment.ref.address_type + ' ' : '';
          address += establishment.ref.address_name ? establishment.ref.address_name + ' ' : '';
          address += establishment.ref.address_town ? establishment.ref.address_town + ' ' : '';
        }
        operation.request_address = address;



        let promise = new Promise((resolve, reject) => {

          setTimeout(() => {

            resolve(
              gmap.getAddress(address, false)
                .then(results => {

                  if (results.length > 1) {
                    return Promise.reject({ status: 'GEOCODING_TOO_MUCH_RESULTS_ERROR' });
                  }

                  try {
                    for (const addressKey in results[0].address) {
                      establishment[addressKey] = results[0].address[addressKey];
                    }
                    for (const locationKey in results[0].location) {
                      establishment[locationKey] = results[0].location[locationKey];
                    }
                    establishment.user_address = address;
                    establishment.formatted_address = results[0].formatted_address;
                    establishment.location_updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
                  } catch (error) {
                    operation.status = 'UNEXPECTED_ERROR';
                  }

                  return establishment.save()
                    .then(() => {
                      operation.status = 'OK';
                    })
                    .catch(error => {
                      operation.status = 'SAVE_ERROR';
                    });

                })
                .catch(error => {
                  operation.status = error.status;
                  operation.error = error;
                })
            );

          }, to);

        });

        to += 100;

        promises.push(promise);

      }

      return Promise.all(promises)
        .then(() => {
          return operations;
        });

    })
    .then((operations) => {
      res.status(200).send({
        operations: operations
      });
    })
    .catch(error => next(new BackError(error)));
};

module.exports = BackOffice_Establishment;