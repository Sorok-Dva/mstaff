const __ = process.cwd();
const { BackError } = require(`${__}/helpers/back.error`);

const Models = require(`${__}/orm/models/index`);

const Notification_ES = {};

Notification_ES.candidateIsAvailableForNeed = (rh, candidate, need) => {
  Models.Notification.create({
    fromUser: candidate.id,
    to: rh.id,
    subject: 'Un candidat est disponible !',
    title: `Bonne nouvelle !\n ${candidate.fullName} est disponible pour votre besoin intitulé "${need.name}".`,
    image: '/assets/images/wink.jpg',
    opts: {
      htmlActions: `<a href="/need/${need.id}" class="btn btn-outline-success">Accéder à mon besoin</a>`
    }
  }).catch(error => new BackError(error));
};

Notification_ES.candidateAnswerForConference = (rh, candidate, es) => {
  Models.Notification.create({
    fromUser: candidate.id,
    to: rh.id,
    subject: 'Réponse à votre demande d\'entretien.',
    title: `Bonne nouvelle !\n ${candidate.fullName} a répondu à votre demande d'entretien.`,
    image: '/assets/images/wink.jpg',
    opts: {
      htmlActions: `<a href="/conferences/calendar" class="btn btn-outline-success">Accéder à mes entretiens</a>`
    }
  }).catch(error => new BackError(error));
};


module.exports = Notification_ES;