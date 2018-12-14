const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models').User;
const UserController = require('../controllers/user');

passport.use(new LocalStrategy((email, password, done) => {
  User.findOne({
    where: { email }
  }).then(user => {
    if (!user) return done(null, false, { message: 'Utilisateur inconnu' });
    UserController.comparePassword(password, user.dataValues.password, (err, isMatch) => {
      if (err) return done(null, false, err);
      if (isMatch) {
        return done(null, user.dataValues);
      } else {
        return done(null, false, { message: 'Mot de passe invalide.' });
      }
    })
  })
}));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) =>
  User.findOne({ where: { id } }).then(user => done(null, user)));

module.exports = passport;