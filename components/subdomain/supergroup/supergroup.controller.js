const __ = process.cwd();
const { _ } = require('lodash');
const Models = require(`${__}/orm/models/index`);
const { BackError } = require(`${__}/helpers/back.error`);
const gmap = require(__ + '/helpers/google-map-api');

const Subdomain_SuperGroup = {};

Subdomain_SuperGroup.ViewIndex = (req, res, next) => {
  if (req.method == 'POST') {

    if (!req.body.all && !req.body.search && !req.body.latlng)
      return res.render('subdomain/supergroup-search', {
        layout: 'subdomain',
        pageName: 'subdomain-supergroup-search',
        layoutName: 'map-search'
      });

    let range = req.body.range ? parseInt(req.body.range) : null;

    let getDataPromise = null;
    if (req.body.all){
      getDataPromise = Models.SuperGroups.repository.getEstablishments(res.locals.supergroup.id)
        .then(results => {
          return { geocodingType: 'none', dataType: 'model', dataResult: results };
        });
    } else {
      const sqlSelect = [
        '`Groups`.id AS group_id',
        '`Groups`.name AS group_name',
        '`Groups`.domain_name AS group_domain_name',
        '`Groups`.domain_enable AS group_domain_enable',
      ];
      const sqlJoin = [
        'LEFT OUTER JOIN EstablishmentGroups ON InBounds.id = EstablishmentGroups.id_es',
        'LEFT OUTER JOIN `Groups` ON EstablishmentGroups.id_group = Groups.id',
        'LEFT OUTER JOIN GroupsSuperGroups ON `Groups`.id = GroupsSuperGroups.id_group',
        'LEFT OUTER JOIN SuperGroups ON GroupsSuperGroups.id_super_group = SuperGroups.id'
      ];
      const sqlWhere = 'WHERE SuperGroups.id = ' + res.locals.supergroup.id;
      range = range ? range : 200;
      if (req.body.latlng) {
        const latLng = req.body.latlng.split(',');
        const geocodingResult = { location: { lat: parseFloat(latLng[0]), lng: parseFloat(latLng[1]) } };
        getDataPromise = Models.Establishment.repository.rawGetInRange(geocodingResult.location, range, sqlSelect, sqlJoin, sqlWhere)
          .then(rows => {
            return { geocodingType: 'range', geocodingResult: geocodingResult, dataType: 'row', dataResult: rows };
          });
      } else {
        getDataPromise = gmap.getAddressFromString(req.body.search, false)
          .then((geocodingResult) => {
            if (geocodingResult.length > 1)
              return Promise.reject({ status: 'GEOCODING_TOO_MUCH_RESULTS_ERROR' });

            if (
            // Linteur de merde! Obligé d'explicitement signifier le prototype, les avantages de JS et de son héritage prototypal sont morts
              Object.prototype.hasOwnProperty.call(geocodingResult[0].address, 'street_number') ||
                Object.prototype.hasOwnProperty.call(geocodingResult[0].address, 'street_name') ||
                Object.prototype.hasOwnProperty.call(geocodingResult[0].address, 'city') ||
                Object.prototype.hasOwnProperty.call(geocodingResult[0].address, 'postal_code')
            ) {
              return Models.Establishment.repository.rawGetInRange(geocodingResult[0].location, range, sqlSelect, sqlJoin, sqlWhere)
                .then(rows => {
                  return { geocodingType: 'range', geocodingResult: geocodingResult[0], dataType: 'row', dataResult: rows };
                });
            } else {
              let where = {};
              for (const addressKey in geocodingResult[0].address) {
                where[addressKey] = geocodingResult[0].address[addressKey];
              }
              return Models.SuperGroups.repository.getEstablishments(res.locals.supergroup.id, where)
                .then(results => {
                  return { geocodingType: 'zone', geocodingResult: geocodingResult[0], dataType: 'model', dataResult: results };
                });
            }
          });
      }
    }

    getDataPromise
      .then(result => {
        let establishments = {};
        let establishmentsByGroups = {};
        if (result.dataType === 'row'){
          for (let i = 0; i < result.dataResult.length; i++){
            const row = result.dataResult[i];
            if (!establishmentsByGroups[row.dataValues.group_id])
              establishmentsByGroups[row.dataValues.group_id] = {
                id: row.dataValues.group_id,
                name: row.dataValues.group_name,
                domain_name: row.dataValues.group_domain_name,
                domain_enable: row.dataValues.group_domain_enable,
                establishments: []
              };
            establishmentsByGroups[row.dataValues.group_id].establishments.push(row.dataValues);
            if (!establishments[row.dataValues.id])
              establishments[row.dataValues.id] = row.dataValues;
          }
        } else {
          for (let i = 0; i < result.dataResult.length; i++){
            const establishment = result.dataResult[i];
            for (let j = 0; j < establishment.EstablishmentGroups.length; j++){
              const group = establishment.EstablishmentGroups[j].Group;
              if (!establishmentsByGroups[group.id])
                establishmentsByGroups[group.id] = {
                  id: group.id,
                  name: group.name,
                  domain_name: group.domain_name,
                  domain_enable: group.domain_enable,
                  establishments: []
                };
              establishmentsByGroups[group.id].establishments.push(establishment);
            }
            if (!establishments[establishment.id])
              establishments[establishment.id] = establishment;
          }
        }

        return res.render('subdomain/supergroup-results', {
          layout: 'subdomain',
          pageName: 'subdomain-supergroup-results',
          layoutName: 'map-results',
          establishments: establishments,
          establishmentsByGroups: establishmentsByGroups,
          geocodingType: result.geocodingType,
          address: result.geocodingType !== 'none' ? result.geocodingResult : null,
          search: result.geocodingType !== 'none' && !req.body.latlng ? req.body.search : null,
          range: range
        });
      })
      .catch(error => {
        res.render('subdomain/supergroup-search', {
          layout: 'subdomain',
          pageName: 'subdomain-supergroup-search',
          layoutName: 'map-search',
          geoError: error
        });
      });

  } else {

    res.render('subdomain/supergroup-search', {
      layout: 'subdomain',
      pageName: 'subdomain-supergroup-search',
      layoutName: 'map-search'
    });

  }
};

Subdomain_SuperGroup.find = (id, next) => {
  Models.SuperGroups.findOne({
    where: { id }
  }).then(supergroup => {
    if (_.isNil(supergroup)) return new BackError('Établissement introuvable', 403);
    next(supergroup);
  }).catch( error => next(new BackError(error)));
};

module.exports = Subdomain_SuperGroup;
