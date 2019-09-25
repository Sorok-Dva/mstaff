const __ = process.cwd();
const Models = require(`${__}/orm/models/index`);
const sequelize = require(__ + '/bin/sequelize');

module.exports.rawGetInRange = (center, radius, select, join, where) => {
  function rad2Deg(rad){
    return rad * (180 / Math.PI);
  }

  function deg2Rad(deg){
    return deg * (Math.PI / 180);
  }

  const earth_radius = 6371;
  let latRad = deg2Rad(center.lat);
  let lngRad = deg2Rad(center.lng);
  let radiusRatio = radius / earth_radius;

  let bounds = {
    max: {
      lat: center.lat + rad2Deg(radiusRatio),
      lng: center.lng + rad2Deg(Math.asin(radiusRatio) / Math.cos(deg2Rad(center.lat)))
    },
    min: {
      lat: center.lat - rad2Deg(radiusRatio),
      lng: center.lng - rad2Deg(Math.asin(radiusRatio) / Math.cos(deg2Rad(center.lat)))
    }
  };

  let sql = '' +
    'SELECT InBounds.*';
  if (select) {
    if (Array.isArray(select))
      sql += ', ' + select.join(', ') + '\n';
    if (typeof select == 'string')
      sql += ', ' + select.replace(/^,/, '') + '\n';
  }
  sql += ', ACOS(SIN(' + latRad + ')*SIN(RADIANS(InBounds.lat)) + COS(' + latRad + ')*COS(RADIANS(InBounds.lat))*COS(RADIANS(InBounds.lng)-' + lngRad + ')) * ' + earth_radius + ' AS distance' + '\n' +
    'FROM (' + '\n' +
    'SELECT Establishments.*' + '\n' +
    'FROM Establishments' + '\n' +
    'WHERE Establishments.lat BETWEEN ' + bounds.min.lat + ' AND ' + bounds.max.lat + '\n' +
    'AND Establishments.lng BETWEEN ' + bounds.min.lng + ' AND ' + bounds.max.lng + '\n' +
    ') AS InBounds' + '\n';
  if (join) {
    if (Array.isArray(join))
      sql += join.join('\n') + '\n';
    if (typeof join == 'string')
      sql += join + '\n';
  }
  if (where){
    if (Array.isArray(where))
      sql += where.join('\n') + '\n';
    if (typeof where == 'string')
      sql += where + '\n';
  }
  sql += 'HAVING distance < ' + radius + '\n' +
    ';';

  return sequelize.query(sql, {
    type: sequelize.QueryTypes.SELECT,
    model: Models.Establishment
  });
};

module.exports.getWhereBelongsToSuperGroup = (id_supergroup, where) => {
  return Models.Establishment.findAll({
    include: {
      model: Models.EstablishmentGroups,
      include: {
        model: Models.Groups,
        include: {
          model: Models.GroupsSuperGroups,
          include: {
            model: Models.SuperGroups
          }
        }
      }
    },
    where: {
      '$EstablishmentGroups->Group->GroupsSuperGroups->SuperGroup.id$': id_supergroup
    }
  });
};