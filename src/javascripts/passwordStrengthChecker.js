let ValidatePassword = function () {
  let rules = [{
    Pattern: '[A-Z]',
    Target: 'uppercase'
  }, {
    Pattern: '[a-z]',
    Target: 'lowercase'
  }, {
    Pattern: '[0-9]',
    Target: 'number'
  }, {
    Pattern: '[!@@#$%^&*]',
    Target: 'symbol'
  }];

  let password = $(this).val();

  $('#length').removeClass(password.length > 6 ? 'bad-rule' : 'good-rule');
  $('#length').addClass(password.length > 6 ? 'good-rule' : 'bad-rule');

  for (let i = 0; i < rules.length; i++) {
    $('#' + rules[i].Target).removeClass(new RegExp(rules[i].Pattern).test(password) ? 'bad-rule' : 'good-rule');
    $('#' + rules[i].Target).addClass(new RegExp(rules[i].Pattern).test(password) ? 'good-rule' : 'bad-rule');
  }
  if ($('ul').find('.bad-rule').length === 0) {
    $('button#resetPassword').removeAttr('disabled');
  } else {
    $('button#resetPassword').attr('disabled', 'disabled');
  }
};

let ValidateConfirmPassword = function () {
  let passwordConfirm = $(this).val();

  let rules = [{
    Pattern: (passwordConfirm === $('#password').val()),
    Target: 'same'
  }];

  if (rules[0].Pattern) {
    $('#' + rules[0].Target).removeClass('bad-rule');
    $('#' + rules[0].Target).addClass('good-rule');
  } else {
    $('#' + rules[0].Target).removeClass('good-rule');
    $('#' + rules[0].Target).addClass('bad-rule');
  }
  if ($('ul').find('.bad-rule').length === 0) {
    $('button#resetPassword').removeAttr('disabled');
  } else {
    $('button#resetPassword').attr('disabled', 'disabled');
  }
};

$(document).ready(() => {
  $('#password').on('keyup', ValidatePassword);
  $('#passwordConfirm').on('keyup', ValidateConfirmPassword);
});