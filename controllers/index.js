const indexController = {};

indexController.getIndex = (req, res) => res.render('index', {title: req.i18n_texts.title});
indexController.getLogin = (req, res) => res.render('users/login', {title: req.i18n_texts.title});

module.exports = indexController;