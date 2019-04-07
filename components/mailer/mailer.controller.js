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

Mailer.notifyCandidatesNeedClosed = (email, context) => {
  let mailObject = {
    subject: 'Besoin clôturé !',
    template: 'candidate/needClosed'
  };
  mailer.sendEmail({
    to: email,
    subject: mailObject.subject,
    template: mailObject.template,
    context
  });
};

Mailer.notifyCandidatesNeedSelect = (email, context) => {
  let mailObject = {
    subject: 'Vous avez été sélectionné pour l\'offre suivante',
    template: 'candidate/needSelected'
  };
  mailer.sendEmail({
    to: email,
    subject: mailObject.subject,
    template: mailObject.template,
    context
  });
};


module.exports = Mailer;