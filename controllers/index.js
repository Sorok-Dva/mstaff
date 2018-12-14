module.exports = {
  getIndex:     (req, res) => res.render('index', { layout: 'landing' }),
  getLogin:     (req, res) => res.render('users/login'),
  postLogin:    (req, res) => res.redirect('/'),
  getLogout:    (req, res) => req.logout() + res.redirect('/'),
  getRegister:  (req, res) => res.render('users/register')
};