const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Models = require('../models');
const UserController = require('../controllers/user');

let attributes = ['id', 'password', 'email', 'type', 'role'];

passport.use(new LocalStrategy((email, password, done) => {
  Models.User.findOne({
    where: { email },
    attributes,
    include:[{
      model: Models.Candidate,
      as: 'candidate'
    }]
  }).then(user => {
    if (!user) return done(null, false, { message: 'Utilisateur inconnu' });
    UserController.comparePassword(password, user.dataValues.password, (err, isMatch) => {
      if (err) return done(null, false, err);
      if (isMatch) {
        let session = {
          id: user.dataValues.id,
          email: user.dataValues.email,
          type: user.dataValues.type,
          role: user.dataValues.role
        };
        return done(null, session);
      } else {
        return done(null, false, { message: 'Mot de passe invalide.' });
      }
    })
  }).catch(err => {
    throw new Error(err);
  });
}));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) =>
  Models.User.findOne({ attributes, where: { id } }).then(user => done(null, user)));

module.exports = passport;