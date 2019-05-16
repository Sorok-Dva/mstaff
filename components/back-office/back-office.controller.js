const __ = process.cwd();
const _ = require('lodash');
const { Sequelize, Op } = require('sequelize');
const moment = require('moment');
const { BackError } = require(`${__}/helpers/back.error`);

const Models = require(`${__}/orm/models/index`);
const layout = 'admin';

const BackOffice = {};

BackOffice.viewIndex = (req, res, next) => {
  let render = { layout, title: 'Tableau de bord', a: { main: 'dashboard', sub: 'overview' } };
  Models.User.count().then(count => {
    render.usersCount = count;
    return Models.Candidate.count();
  }).then(count => {
    render.candidatesCount = count;
    return Models.Wish.count();
  }).then(count => {
    render.wishesCount = count;
    return Models.Establishment.count();
  }).then(count => {
    render.esCount = count;
    return Models.Establishment.findAll({
      attributes: ['id', 'createdAt',  [Sequelize.fn('COUNT', 'id'), 'count']],
      where: {
        createdAt: {
          [Op.between]: [ moment().subtract(6, 'days')._d, new Date()]
        }
      },
      group: [Sequelize.fn('DAY', Sequelize.col('createdAt'))]
    });
  }).then(data => {
    render.esWeekRegistration = data;
    return Models.User.findAll({
      attributes: ['id', 'createdAt',  [Sequelize.fn('COUNT', 'id'), 'count']],
      where: {
        createdAt: {
          [Op.between]: [ moment().subtract(6, 'days')._d, new Date()]
        }
      },
      group: [Sequelize.fn('DAY', Sequelize.col('createdAt'))]
    });
  }).then(data => {
    render.usersWeekRegistration = data;
    return Models.Wish.findAll({
      attributes: ['id', 'createdAt',  [Sequelize.fn('COUNT', 'id'), 'count']],
      where: {
        createdAt: {
          [Op.between]: [ moment().subtract(6, 'days')._d, new Date()]
        }
      },
      group: [Sequelize.fn('DAY', Sequelize.col('createdAt'))]
    });
  }).then(data => {
    render.wishesWeek = data;
    render.usersWeekCount = 0; render.ESWeekCount = 0; render.wishesWeekCount = 0;
    /* eslint-disable no-return-assign */
    render.esWeekRegistration.map((data) => render.ESWeekCount += parseInt(data.dataValues.count));
    render.usersWeekRegistration.map((data) => render.usersWeekCount += parseInt(data.dataValues.count));
    render.wishesWeek.map((data) => render.wishesWeekCount += parseInt(data.dataValues.count));
    /* eslint-enable no-return-assign */
    res.render('back-office/index', render);
  });
};

BackOffice.ViewStats = (req, res) => {
  res.render('back-office/stats', { layout, title: 'Statistiques', a: { main: 'dashboard', sub: 'stats' } })
};

BackOffice.ViewSettings = (req, res, next) => {
  res.render('back-office/settings', { layout, title: 'Paramètres de l\'application', a: { main: 'serverSettings', sub: 'main' } })
};

module.exports = BackOffice;