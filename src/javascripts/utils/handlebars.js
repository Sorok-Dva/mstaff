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

Handlebars.registerHelper('weekStats', (object) => {
  let res = [];
  for (let day = 6; day >= 0; day--) {
    let date = day === 0 ? moment().format('MMM Do YY') : moment().subtract(day, 'days').format('MMM Do YY');
    let isNull = true;
    object.map((user) => {
      if (date === moment(user.createdAt).format('MMM Do YY')){
        res.push(user.dataValues.count);
        isNull = false;
      }
    });
    if (isNull) res.push(0);
  }
  return res;
});

Handlebars.registerHelper('repeat', function (n, block) {
  let accum = '';
  for (let i = 0; i < n; ++i)
    accum += block.fn(i);
  return accum;
});

Handlebars.registerHelper('json', function (context) {
  return JSON.stringify(context);
});

Handlebars.registerHelper('partial', function (name) {
  return name;
});

Handlebars.registerHelper('candidateProfilePercentage', (percentage) => {
  if (_.isNil(percentage)) return '0%';
  else if (_.isNil(percentage.total)) return '0%';
  else return percentage.total === 100 ? '<i class="fal fa-badge-check"></i>' : `${percentage.total}%`;
});

Handlebars.registerHelper('countInObject', (object, property, search) => {
  let count = 0;
  if (!_.isNil(object)) object.forEach((e, i) => object[i][property] === search ? count++ : null);
  return count;
});

/* eslint-disable no-console */
Handlebars.registerHelper('debug', function () {
  console.log('Context:', this);
  debug(Array.prototype.slice.call(arguments, 0, -1));
});

Handlebars.registerHelper('log', function () {
  console.log(['Values:'].concat(
    Array.prototype.slice.call(arguments, 0, -1)
  ));
});
/* eslint-enable no-console */

Handlebars.registerHelper('breaklines', function(text) {
  text = Handlebars.Utils.escapeExpression(text);
  text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
  return new Handlebars.SafeString(text);
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

Handlebars.registerHelper('firstPost', experiences => {
  if (_.isNil(experiences) || experiences.length === 0) return 'Aucun poste';
  let posts = [];
  experiences.map(xp => posts.includes(xp.poste.name) ? null : posts.push(xp.poste.name));
  let other = '';
  if (posts.length > 1) other = `... (${posts.length - 1} de plus)`;
  return `${posts[0]}${other}`
});

Handlebars.registerHelper('otherPostsPopover', experiences => {
  if (_.isNil(experiences) || experiences.length === 0) return '';
  let posts = [];
  experiences.map(xp => posts.includes(xp.poste.name) ? null : posts.push(xp.poste.name));
  if (posts.length < 2) return '';
  posts.shift();
  let string = posts.toString();
  return `data-toggle="tooltip"  data-placement="top" title="${string.replace(/,/g, ', ')}"`
});

Handlebars.registerHelper('firstService', experiences => {
  if (_.isNil(experiences) || experiences.length === 0) return 'Aucun service';
  let services = [];
  experiences.map(xp => services.includes(xp.service.name) ? null : services.push(xp.service.name));
  let other = '';
  if (services.length > 1) other = `... (et ${services.length - 1} de plus)`;
  return `${services[0]}${other}`
});

Handlebars.registerHelper('otherServicesPopover', experiences => {
  if (_.isNil(experiences) || experiences.length === 0) return '';
  let services = [];
  experiences.map(xp => services.includes(xp.service.name) ? null : services.push(xp.service.name));
  if (services.length > 1) {
    services.shift();
    let string = services.toString();
    return `data-toggle="tooltip"  data-placement="top" title="${string.replace(/,/g, ', ')}"`
  } else return '';
});

Handlebars.registerHelper('firstPost_Search', applications => {
  if (_.isNil(applications) || applications.length === 0) return 'Aucun poste';
  let posts = [];
  if (applications.Wish) applications.Wish.posts.map(post => posts.includes(post) ? null : posts.push(post));
  else {
    applications.map(application => {
      application.Wish.posts.map(post => posts.includes(post) ? null : posts.push(post))
    });
  }
  let other = '';
  if (posts.length > 1) other = `... (${posts.length - 1} de plus)`;
  return `${posts[0]}${other}`
});

Handlebars.registerHelper('otherPostsPopover_Search', applications => {
  if (_.isNil(applications) || applications.length === 0) return '';
  let posts = [];
  if (applications.Wish) applications.Wish.posts.map(post => posts.includes(post) ? null : posts.push(post));
  else {
    applications.map(application => {
      application.Wish.posts.map(post => posts.includes(post) ? null : posts.push(post))
    });
  }
  if (posts.length < 2) return '';
  posts.shift();
  let string = posts.toString();
  return `data-toggle="tooltip"  data-placement="top" title="${string.replace(/,/g, ', ')}"`
});

Handlebars.registerHelper('firstService_Search', applications => {
  if (_.isNil(applications) || applications.length === 0) return 'Aucun service';
  let services = [];
  if (applications.Wish) {
    if (applications.Wish.services.length === 0) return 'Aucun service';
    applications.Wish.services.map(service => services.includes(service) ? null : services.push(service));
  }
  else {
    applications.map(application => {
      application.Wish.services.map(service => services.includes(service) ? null : services.push(service))
    });
  }
  let other = '';
  if (services.length > 1) other = `... (et ${services.length - 1} de plus)`;
  return `${services[0]}${other}`
});

Handlebars.registerHelper('otherServicesPopover_Search', applications => {
  if (_.isNil(applications) || applications.length === 0) return '';
  let services = [];
  if (applications.Wish) {
    if (applications.Wish.services.length === 0) return '';
    applications.Wish.services.map(service => services.includes(service) ? null : services.push(service));
  }
  else {
    applications.map(application => {
      application.Wish.services.map(service => services.includes(service) ? null : services.push(service))
    });
  }
  if (services.length > 1) {
    services.shift();
    let string = services.toString();
    return `data-toggle="tooltip"  data-placement="top" title="${string.replace(/,/g, ', ')}"`
  } else return '';
});

Handlebars.registerHelper('isAvailable', (method, applications) => {
  if (_.isNil(applications) || applications.length === 0) {
    switch (method) {
      case 'avatarClass': return 'off';
      case 'class': return 'unavailable';
      case 'text': return 'Indisponible';
    }
  }
  let available = false;
  applications.map(application => application.is_available ? available = true : null);
  switch (method) {
    case 'avatarClass': return available ? 'on' : 'off';
    case 'class': return available ? 'available' : 'unavailable';
    case 'text': return available ? 'Disponible' : 'Indisponible';
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