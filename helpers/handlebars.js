/**
 * Handlebars helpers
 */
const moment = require('moment');
const _ = require('lodash');

module.exports.register = async (Handlebars) => {
  /**
   * Returns date with defined format (using moment.js)
   *
   * ```handlebars
   * {{date dateObject 'DD/MM/YYY'}}
   * <!-- results in: '01/01/2019' -->
   * ```
   * @param {Date} `context` Date Object
   * @param {String} `format` Date Format wanted
   * @return {String} Date object formatted in text.
   */
  Handlebars.registerHelper('date', (context, format) => {
    return moment(new Date(context)).format(format);
  });

  /**
   * Returns age from dateObject with age format (years, months, weeks, days, hours, minutes, seconds)
   *
   * ```handlebars
   * {{age dateObject 'years'}}
   * <!-- results in: '18' -->
   * ```
   * @param {Date} `context` Date Object
   * @param {String} `format` Age Format wanted
   * @return {String} Date object formatted in age.
   */
  Handlebars.registerHelper('age', (context, format) => {
    return moment().diff(new Date(context), format);
  });

  /**
   * Returns a number to LocaleString (huge numbers formatted)
   *
   * ```handlebars
   * {{number 10000}}
   * <!-- results in: '10,000' for FR locale for example -->
   * ```
   * @param {Number} `number` Number
   * @return {String} Number in locale String
   */
  Handlebars.registerHelper('number', (number) => {
    if (number) {
      return number.toLocaleString();
    } else {
      return number;
    }
  });

  /**
   * Returns a formatted text for users role
   *
   * ```handlebars
   * {{rolify user.role}}
   * <!-- results in: 'Utilisateur' -->
   * ```
   * @param {String} `role` A User Role or Type (User, Admin, admin, es, demo, candidate)
   * @return {String} data role into prettiest format
   */
  Handlebars.registerHelper('rolify', (role) => {
    switch (role) {
      case 'User': return 'Utilisateur';
      case 'Admin': return 'Administrateur';
      case 'admin': return 'Administrateur';
      case 'es': return 'Établissement';
      case 'demo': return 'Démo';
      case 'candidate': return 'Candidat';
      default: return role
    }
  });

  /**
   * Returns "selected" css class for stars rating system
   *
   * ```handlebars
   * {{rating knowledge.stars 1}}
   * <!-- results in: 'selected' -->
   * ```
   * @param {Number} `stars` Number of stars defined by user
   * @param {Number} `star` Current li star
   * @return {String} "selected" class for the right li of rating class system
   */
  Handlebars.registerHelper('rating', (stars, star) => {
    if (star <= stars) {
      return 'selected';
    }
  });

  Handlebars.registerHelper('ifCond', (v1, operator, v2, options) => {
    switch (operator) {
      case '==':
        return v1 == v2 ? options.fn(this) : options.inverse(this);
      case '===':
        return v1 === v2 ? options.fn(this) : options.inverse(this);
      case '!=':
        return v1 != v2 ? options.fn(this) : options.inverse(this);
      case '!==':
        return v1 !== v2 ? options.fn(this) : options.inverse(this);
      case '<':
        return v1 < v2 ? options.fn(this) : options.inverse(this);
      case '<=':
        return v1 <= v2 ? options.fn(this) : options.inverse(this);
      case '>':
        return v1 > v2 ? options.fn(this) : options.inverse(this);
      case '>=':
        return v1 >= v2 ? options.fn(this) : options.inverse(this);
      case '&&':
        return v1 && v2 ? options.fn(this) : options.inverse(this);
      case '||':
        return v1 || v2 ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  });

  /**
   * Returns result of math operation
   *
   * ```handlebars
   * {{math 6 '*' 7}}
   * <!-- results in: '42' -->
   * ```
   * @param {Number} `lvalue`
   * @param {String} `operator`
   * @param {Number} `rvalue`
   * @return {String} Operation result
   */
  Handlebars.registerHelper('math', (lvalue, operator, rvalue) => {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
      '+': lvalue + rvalue,
      '-': lvalue - rvalue,
      '*': lvalue * rvalue,
      '/': lvalue / rvalue,
      '%': lvalue % rvalue
    }[operator];
  });

  Handlebars.registerHelper('has_passed', (dateString, options) => {
    if (moment(dateString).isAfter(moment())) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper('addDocIcon', (object, type) => {
    let iClass = 'plus-circle';
    if (!_.isNil(object)) object.forEach((e, i) => {
      object[i].type === type ? iClass = 'check-circle' : null
    });
    return iClass;
  });

  Handlebars.registerHelper('countFiles', (object, type) => {
    let count = 0;
    if (!_.isNil(object)) object.forEach((e, i) => object[i].type === type ? count++ : null);
    return count;
  });

  Handlebars.registerHelper('countInObject', (object, property, search) => {
    let count = 0;
    if (!_.isNil(object)) object.forEach((e, i) => object[i][property] === search ? count++ : null);
    return count;
  });

  Handlebars.registerHelper('weekStats', (object) => {
    if (_.isNil(object)) return [];
    let res = [];
    for (let day = 6; day >= 0; day--) {
      let date = day === 0 ? moment().format('MMM Do YY') : moment().subtract(day, 'days').format('MMM Do YY');
      let isNull = true;
      object.map((entity) => {
        if (date === moment(entity.createdAt || entity.last_login || entity.updatedAt).format('MMM Do YY')){
          res.push(entity.dataValues.count);
          isNull = false;
        }
      });
      if (isNull) res.push(0);
    }
    return res;
  });

  Handlebars.registerHelper('candidateProfilePercentage', (percentage) => {
    if (_.isNil(percentage)) return '0%';
    else if (_.isNil(percentage.total)) return '0%';
    else return percentage.total === 100 ? '<i class="fal fa-badge-check"></i>' : `${percentage.total}%`;
  });

  /* eslint-disable no-console */
  Handlebars.registerHelper('debug', function () {
    console.log('Context:', this);
    console.log(['Values:'].concat(
      Array.prototype.slice.call(arguments, 0, -1)
    ));
  });

  Handlebars.registerHelper('log', function () {
    console.log(['Values:'].concat(
      Array.prototype.slice.call(arguments, 0, -1)
    ));
  });
  /* eslint-enable no-console */

  Handlebars.registerHelper('repeat', function (n, block) {
    let accum = '';
    for (let i = 0; i < n; ++i)
      accum += block.fn(i);
    return accum;
  });

  Handlebars.registerHelper('showCategory', function (categoryPS_id) {
    switch (categoryPS_id) {
      case 1:
        return 'None';
      case 2:
        return 'Médical';
      case 3:
        return 'Paramédical';
      case 4:
        return 'Administratif';
      case 5:
        return 'Libéral';
      case 6:
        return 'Mix';
      default:
        return '';
    }
  });

  Handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context);
  });

  Handlebars.registerHelper('calendarEventColor', conference => {
    switch (conference.status) {
      case 'refused':
        return '#b74b4b';
      case 'expired':
        return 'grey';
    }
    switch (conference.type) {
      case 'online':
        return 'green';
      case 'physical':
        return 'orange';
      default:
        return 'grey';
    }
  });

  Handlebars.registerHelper('showVisioLink', conference => {
    if (_.isNil(conference)) return '{{showVisioLink error - empty object}}';
    const _15minutes = moment(conference.date).subtract(15, 'minutes');
    const _2hours = moment(conference.date).add(2, 'hours');
    if (moment().isAfter(_15minutes)) {
      if (moment().isAfter(_2hours)) {
        return `L'entretien est terminé. Le lien n'est plus accessible.`;
      } else {
        let { key } = conference;
        return `<a href="https://meet.jit.si/mstaff-session-${key}" target="_blank">https://meet.jit.si/mstaff-session-${key}</a>`;
      }
    } else {
      return `Vous aurez accès au lien 15 minutes avant le début de l'entretien.`;
    }
  });

  Handlebars.registerHelper('wishValidity', wish => {
    if (_.isNil(wish)) return '{{wishValidity error - empty object}}';
    const until = moment(wish.renewed_date).add(30, 'days');
    const today = moment().format('YYYY-MM-DD');
    let timeLeft = until.diff(today, 'days');
    let color;
    if (timeLeft <= 30 && timeLeft >= 16) color = 'blue';
    if (timeLeft <= 15 && timeLeft >= 7) color = 'darkorange';
    if (timeLeft <= 6 && timeLeft >= 0) color = 'red';
    if (_.isNil(color)) {
      return `<h4 data-h4-wishId="${wish.id}"><i class="fal fa-sync" data-refreshWish-id="${wish.id}" style="color: red"></i> Expiré</h4>`;
    } else {
      return `<h4 data-h4-wishId="${wish.id}"><i class="fal fa-clock" data-wish-id="${wish.id}" style="color: ${color}"></i> ${timeLeft} jours</h4>`;
    }
  });

  /**
   * Returns french text of contract type
   *
   * ```handlebars
   * {{contractType wish.contract_type}}
   * <!-- results in: 'Stage' for example -->
   * ```
   * @param {string} `type` Contract Type
   * @return {String} Transformed text
   */
  Handlebars.registerHelper('contractType', (type) => {
    switch (type) {
      case 'internship': return 'Stage';
      case 'vacation': return 'Vacation';
      case 'cdi-cdd': return 'CDI/CDD';
      case 'CDI': return 'CDI';
      case 'CP': return 'Apprentissage / Contrat Pro';
      case 'CL': return 'Collaboration Libérale';
      case 'AL': return 'Installation / Association Libérale';
      case 'RCL': return 'Reprise Cabinet Libéral';
      case 'CDD': return 'Missions / Vacations / CDD';
      case 'RL': return 'Remplacement Libéral';
    }
  });
};