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
    default:
      mailObject.subject = 'Création de votre compte sur Mstaff.';
      mailObject.template = 'default/emailValidation';
      break;
  }
  mailer.sendEmail({
    to: user.email,
    subject: mailObject.subject,
    template: mailObject.template,
    context: { user }
  });
};

Mailer.sendUserResetPasswordLink = (user) => {
  let mailObject = {};
  mailObject.subject = 'Réinitialisation de votre mot de passe Mstaff.';
  mailObject.template = 'user/resetPasswordLink';
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

Mailer.notifyCandidatesNeedConference = (email, context) => {
  let mailObject = {
    subject: 'Un entretien vous a été proposé !',
    template: 'candidate/needConference-' + context.conference.type
  };
  mailer.sendEmail({
    to: email,
    subject: mailObject.subject,
    template: mailObject.template,
    context
  });
};

Mailer.notifyCandidatesNeedConferenceDeleted = (email, context) => {
  let mailObject = {
    subject: 'Un entretien a été annulé.',
    template: 'candidate/needConference-delete'
  };
  mailer.sendEmail({
    to: email,
    subject: mailObject.subject,
    template: mailObject.template,
    context
  });
};

Mailer.newWishCreated = (email, context) => {
  let mailObject = {
    subject: 'Votre souhait de candidature a été envoyé.',
    template: 'candidate/newWish'
  };
  mailer.sendEmail({
    to: email,
    subject: mailObject.subject,
    template: mailObject.template,
    context
  });
};

Mailer.notifyESCandidateAvailable = (email, context) => {
  let mailObject = {
    subject: 'Nouveaux candidats disponibles.',
    template: 'es/need/available_candidate'
  };
  mailer.sendEmail({
    to: email,
    subject: mailObject.subject,
    template: mailObject.template,
    context
  });
};

Mailer.notifyESCandidateAnswerConference = (email, context) => {
  let mailObject = {
    subject: 'Réponse pour votre demande d\'entretien.',
    template: 'es/need/conf_answer_candidate'
  };
  mailer.sendEmail({
    to: email,
    subject: mailObject.subject,
    template: mailObject.template,
    context
  });
};



module.exports = Mailer;