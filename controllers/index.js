const indexController = {};

indexController.getIndex = (req, res) => res.render('index', {layout: 'landing'});
indexController.getLogin = (req, res) => res.render('users/login');

module.exports = indexController;