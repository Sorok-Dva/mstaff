const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Models = require('../models');
const UserController = require('../controllers/user');

let attributes = ['id', 'email', 'firstName', 'lastName', 'type', 'role'];

passport.use(new LocalStrategy((email, password, done) => {
  Models.User.findOne({
    where: { email },
    attributes: ['id', 'password', 'email', 'role']
  }).then(user => {
    if (!user) return done(null, false, { message: 'Utilisateur inconnu' });
    UserController.comparePassword(password, user.dataValues.password, (err, isMatch) => {
      if (err) return done(null, false, err);
      if (isMatch) {
        let session = {
          id: user.dataValues.id,
          email: user.dataValues.email,
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

passport.deserializeUser((id, done) => {
  Models.User.findOne({ attributes, where: { id } }).then(user => {
    let session = {
      id: user.dataValues.id,
      email: user.dataValues.email,
      fullName: user.fullName,
      type: user.dataValues.type,
      role: user.dataValues.role
    };
    done(null, session)
  });
});

module.exports = passport;