const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Models = require('../models');
const UserController = require('../controllers/user');

passport.use(new LocalStrategy((email, password, done) => {
  Models.User.findOne({
    where: { email },
    include:[{
      model: Models.Candidate,
      as: 'candidate'
    }]
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
  Models.User.findOne({ where: { id } }).then(user => done(null, user)));

module.exports = passport;