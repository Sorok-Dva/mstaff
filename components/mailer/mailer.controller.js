const __ = process.cwd();

const mailer = require(`${__}/bin/mailer`);

const Mailer = {};

Mailer.sendUserVerificationEmail = (user) => {
  let mailObject = {};
  switch (user.type) {
    case 'candidate':
      mailObject.subject = 'Création de votre compte sur Mstaff.';
      mailObject.template = 'candidate/emailValidation';
      break;
  }
  mailer.sendEmail({
    to: user.email,
    subject: mailObject.subject,
    template: mailObject.template,
    context: { user }
  });
};

module.exports = Mailer;