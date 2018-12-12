const nodemailer = require('nodemailer');
const env = require('dotenv').config().parsed;
const Mailer = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.GMAIL_EMAIL,
    pass: env.GMAIL_PASS
  }
});

Mailer.sendEmail = (to, subject, text) => {
  transporter.sendMail({
    from: `"${env.SITE_TITLE}" \<${env.GMAIL_EMAIL}\>`,
    to,
    subject,
    html: putText2Template(subject, text)
  }, (error, info) => {
    if (error) {
      console.log(error);
    }
  });
};

Mailer.sendValidationMail = (nickname, to, key) => {
  let text = ``;

  transporter.sendMail({
    from: `"${env.SITE_TITLE}" \<${env.GMAIL_EMAIL}\>`,
    to,
    subject: '',
    html: putText2Template('', text)
  }, (error, info) => {
    if (error) {
      console.log('Mailer error :' + error, info);
    }
  });
};

const putText2Template = (title, text) => {
  return `${title}${text}`;
};

module.exports = Mailer;
