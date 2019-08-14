const __ = process.cwd();
const { Sequelize, Op } = require('sequelize');
const moment = require('moment');
const fs = require('fs');

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
    return Models.Application.count();
  }).then(count => {
    render.applicationsCount = count;
    return Models.User.findAll({
      attributes: ['id', 'last_login',  [Sequelize.fn('COUNT', 'id'), 'count']],
      where: {
        last_login: {
          [Op.between]: [ moment().subtract(6, 'days')._d, new Date()]
        }
      },
      group: [Sequelize.fn('DAY', Sequelize.col('last_login'))]
    });
  }).then(data => {
    render.usersLoginsWeek = data;
    return Models.User.findAll({
      attributes: ['id', 'updatedAt',  [Sequelize.fn('COUNT', 'id'), 'count']],
      where: {
        updatedAt: {
          [Op.between]: [ moment().subtract(6, 'days')._d, new Date()]
        }
      },
      group: [Sequelize.fn('DAY', Sequelize.col('updatedAt'))]
    });
  }).then(data => {
    render.usersLastActivityWeek = data;
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
    // it's really ugly, if you have a smartest solution don't hesitate to improve this shit !
    fs.readdir( '/srv/db_dumps/', (error, db_dumps) => {
      fs.readdir( `${__}/public/uploads`, (error, uploads) => {
        render.documents = _.isNil(uploads) ? 0 : uploads.length;
        render.db_dumps = _.isNil(db_dumps) ? 0 : db_dumps.length;
        render.wishesWeek = data;
        render.usersWeekCount = 0; render.usersLoginWeekCount = 0; render.usersLAWeekCount = 0; render.wishesWeekCount = 0;
        /* eslint-disable no-return-assign */
        render.usersLastActivityWeek.map((data) => render.usersLAWeekCount += parseInt(data.dataValues.count));
        render.usersLoginsWeek.map((data) => render.usersLoginWeekCount += parseInt(data.dataValues.count));
        render.usersWeekRegistration.map((data) => render.usersWeekCount += parseInt(data.dataValues.count));
        render.wishesWeek.map((data) => render.wishesWeekCount += parseInt(data.dataValues.count));
        /* eslint-enable no-return-assign */
        return res.render('back-office/index', render);
      });
    });
  });
};

BackOffice.ViewStats = (req, res) => {
  res.render('back-office/stats', { layout, title: 'Statistiques', a: { main: 'dashboard', sub: 'stats' } })
};

BackOffice.ViewSettings = (req, res, next) => {
  res.render('back-office/settings', { layout, title: 'Paramètres de l\'application', a: { main: 'serverSettings', sub: 'main' } })
};

module.exports = BackOffice;