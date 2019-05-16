const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Models = require('../orm/models');
const UserComponent = require('../components/user');

let attributes = ['id', 'email', 'firstName', 'lastName', 'type', 'role', 'photo', 'opts'];

passport.use(new LocalStrategy({ passReqToCallback: true }, (req, email, password, done) => {
  Models.User.findOne({
    where: { email },
    attributes: ['id', 'password', 'email', 'role', 'opts', 'photo']
  }).then(user => {
    if (!user) return done(null, false, req.flash('error_msg', 'Utilisateur inconnu.'));
    UserComponent.Main.comparePassword(password, user.dataValues.password, (err, isMatch) => {
      if (err) return done(null, false, err);
      if (isMatch) {
        let session = {
          id: user.dataValues.id,
          email: user.dataValues.email,
          role: user.dataValues.role,
          opts: user.opts,
          photo: user.photo
        };
        return done(null, session);
      } else {
        return done(null, false, req.flash('error_msg', 'Mot de passe invalide.'));
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
      fullName: `${user.dataValues.firstName} ${user.dataValues.lastName}`,
      type: user.dataValues.type,
      role: user.dataValues.role,
      opts: user.opts,
      photo: user.photo
    };
    done(null, session)
  });
});

module.exports = passport;