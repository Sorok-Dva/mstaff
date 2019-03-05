const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const env = require('dotenv').config().parsed;
const Mailer = {};

const options = {
  viewEngine: {
    extname: '.hbs',
    layoutsDir: 'views/layouts/',
    defaultLayout: 'mail_template',
    partialsDir: 'views/partials/'
  },
  viewPath: 'views/email/',
  extName: '.hbs'
};

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: env.GMAIL_EMAIL,
    clientId: env.GMAIL_CLIENT_ID,
    clientSecret: env.GMAIL_CLIENT_SECRET,
    refreshToken: env.GMAIL_REFRESH_TOKEN,
    accessToken: env.GMAIL_ACCESS_TOKEN
  }
});

transporter.use('compile', hbs(options));

Mailer.sendEmail = (opts) => {
  transporter.sendMail({
    from: `"${env.SITE_TITLE}" \<${env.GMAIL_EMAIL}\>`,
    to: opts.to,
    subject: opts.subject,
    template: opts.template,
    context: opts.context
  }, (error, info) => {
    transporter.close();
    /* eslint-disable no-console */
    if (error) return console.log(error);
    if (info) return console.log(`[MAIL_INFO]`, JSON.stringify(info));
    /* eslint-enable no-console */
  });
};

module.exports = Mailer;