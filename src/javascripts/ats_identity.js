function identityListener() {
  document.getElementById('toRecap').addEventListener('verified', () => {
    saveDatas();
    loadTemplate('/static/views/ats/recap.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    });
  }, false);

  $('#backToSkill').click(function() {
    loadTemplate('/static/views/ats/skill.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });

  $('#toRecap').click(function() {
    verifyInputs();
  });

  let passwordIndicator = $('.password-indicator ul');

  $('#identityPassword').on('focus', () => {
    passwordIndicator.css('visibility', '');
  }).on('blur', () => {
    passwordIndicator.css('visibility', 'hidden');
  }).on('keyup', () => {
    displayIndicator();
  });
}

function isAvailableMail(mail){
  return new Promise( resolve => {
    $.get(`/emailAvailable/${mail}`, (data) => {
      resolve(data);
    }).catch((xhr, status, error) => catchError(xhr, status, error));
  });
};

function displayIndicator(){
  let password = $('#identityPassword').val();
  let rules = [
    { Pattern: '[A-Z]', Target: 'uppercase' },
    { Pattern: '[0-9]', Target: 'number' },
    { Pattern: '[!@#$%^&*]', Target: 'symbol' }
  ];

  $('#length').removeClass('bad-rule good-rule').addClass(password.length < 8 ? 'bad-rule' : 'good-rule');
  rules.forEach( rule => {
    $('#' + rule.Target).removeClass('bad-rule good-rule').addClass(new RegExp(rule.Pattern).test(password) ? 'good-rule' : 'bad-rule');
  });
};

function togglePasswordVisibility() {
  let x = document.getElementById("identityPassword");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
};

function regexVerif(type, entity){
  let nameRegex = /^([a-zA-Z áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\-]){2,30}$/;
  let trimmedEntity = entity.trim();

  if (type === 'forename'){
    if ($.isEmptyObject(trimmedEntity))
      return notify('noForename');
    else if (!nameRegex.test(trimmedEntity))
      return notify('wrongForenameFormat');
    else
      return true;
  } else if (type === 'name'){
    if ($.isEmptyObject(trimmedEntity))
      return  notify('noName');
    else if (!nameRegex.test(trimmedEntity))
      return notify('wrongNameFormat');
    else
      return true;
  }
}

function verifyInputs(){
  let mail = $('#identityMail').val();
  let mailRegex = '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,4})+$';

  let isValidMail = mail.match(mailRegex) !== null ? true : notify('wrongMailFormat');
  if (isValidMail){
    if (mail !== permissions.checkingMail){
      permissions.checkingMail = mail;
      isAvailableMail(mail).then(data => {
        if (data.available){
          permissions.checkingMail = null;

          // if (!nameRegex.test(value))


          let forename = $('#identityForename').val();
          let name = $('#identityName').val();
          let birthDate = $('#identityBirth').data("DateTimePicker").date();
          let postal = $('#identityPostal').val();
          let city = $('#identityCity').val();
          let password = $('#identityPassword').val();
          let isValidForename = regexVerif('forename', forename);
          let isValidName = regexVerif('name', name);
          let isValidPostal = !isNaN(postal) ? true : notify('wrongPostalCode');
          let isValidCity = !$.isEmptyObject(city);
          let isValidBirthDate = new Date(birthDate) !== 'Invalid Date' ? true : notify('wrongBirthDateFormat');
          if (isValidBirthDate)
            isValidBirthDate = moment(birthDate).isBefore(moment().subtract(18, 'years')) ? true : notify('wrongBirthDate');
          let isValidPhone = iti.isValidNumber() ? true : notify('wrongPhoneNumber');
          let passwordRegex = '^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])([!@#$%^&*\\w]{8,})$';
          let isValidPassword = password.match(passwordRegex) !== null ? true : notify('wrongPasswordFormat');
          if (isValidForename && isValidName && isValidPostal && isValidCity && isValidBirthDate && isValidPhone && isValidPassword){
            permissions.checkingMail = null;
            document.getElementById('toRecap').dispatchEvent(permissions.verifiedEvent);
          }
        }
        else notify('mailAlreadyUse');
      });
    } else {
      notify('mailAlreadyUse');
    }
  }
};

function notify(error){
  switch (error) {
    case 'noForename':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci d'indiquer votre prénom.`
      });
      break;
    case 'wrongForenameFormat':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci d'indiquer un prénom comportant uniquement des caractères alphabétiques (espace et trait d'union autorisés).`
      });
      break;

    case 'noName':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci d'indiquer votre nom.`
      });
      break;
    case 'wrongNameFormat':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci d'indiquer un nom comportant uniquement des caractères alphabétiques (espace et trait d'union autorisés).`
      });
      break;

    case 'wrongPostalCode':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci d'indiquer un code postal valide.`
      });
      break;
    case 'wrongBirthDateFormat':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci de saisir un format de date valide.`
      });
      break;
    case 'wrongBirthDate':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `L'age légal minimum requis pour vous inscrire sur Mstaff est de 18 ans.`
      });
      break;
    case 'wrongPhoneNumber':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci de saisir un numéro de téléphone valide.`
      });
      break;
    case 'wrongMailFormat':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci de saisir un mail valide, exemple : identifiant@domain.xxx .`
      });
      break;
    case 'wrongPasswordFormat':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci de saisir un password valide.`
      });
      break;
    case 'mailAlreadyUse':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Cet email est déjà utilisé.`
      });
      break;

  }
  return false;
};

function saveDatas(){
  candidateDatas.identity.firstName = $('#identityForename').val();
  candidateDatas.identity.lastName = $('#identityName').val();
  candidateDatas.identity.phone = iti.getNumber();
  candidateDatas.identity.country = $('#identityCountry').val();
  candidateDatas.identity.email = $('#identityMail').val();
  candidateDatas.identity.password = $('#identityPassword').val();
  candidateDatas.identity.birthday = new Date($('#identityBirth').data("DateTimePicker").date());
  candidateDatas.identity.postal_code = $('#identityPostal').val();
  candidateDatas.identity.town = $('#identityCity').val();
};

function init_identity(){
  identityListener();
  $('#identityBirth').datetimepicker({
    format: 'D MMMM YYYY',
    useCurrent: false,
    ignoreReadonly: true,
  });
  iti = intlTelInput(document.querySelector("#identityPhone"), {
    utilsScript: '/static/assets/js/utils.js',
    preferredCountries: ["fr", "gb", "us"],
    initialCountry: "auto",
    geoIpLookup: function(success, failure) {
      $.get("https://ipinfo.io", function() {}, "jsonp").always(function(resp) {
        let countryCode = (resp && resp.country) ? resp.country : "";
        success(countryCode);
      });
    },
  });
};

function reload_identity(){
  $('#identityBirth').data("DateTimePicker").date(candidateDatas.identity.birthday);
};

$(document).ready(() => {
  init_identity();
  if(candidateDatas.identity.birthday)
    reload_identity();
});
