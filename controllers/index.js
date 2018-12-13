const indexController = {};

indexController.getIndex = (req, res) => res.render('index', { layout: 'landing' });
indexController.getLogin = (req, res) => res.render('users/login');
indexController.getRegister = (req, res) => res.render('users/register');
indexController.postRegister = (req, res) => res.render('users/register');

module.exports = indexController;