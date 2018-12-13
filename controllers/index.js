const indexController = {};

indexController.getIndex = (req, res) => res.render('index', { layout: 'landing' });
indexController.getLogin = (req, res) => res.render('users/login');
indexController.postLogin = (req, res) => res.redirect('/');
indexController.getLogout = (req, res) => req.logout() + res.redirect('/');
indexController.getRegister = (req, res) => res.render('users/register');

module.exports = indexController;