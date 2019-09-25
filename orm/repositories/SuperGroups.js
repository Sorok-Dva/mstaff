const __ = process.cwd();
const Models = require(`${__}/orm/models/index`);

module.exports.getEstablishments = (id_supergroup, where) => {
  where['$EstablishmentGroups->Group->GroupsSuperGroups->SuperGroup.id$'] = id_supergroup;
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
    where: where
  });
};