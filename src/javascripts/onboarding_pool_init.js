$(document).ready(function () {
  emailIsAvailable(data.email).then(available => {
    data.permissions = {
      checkingMail: null,
      verifiedEvent: new Event('verified')
    };
    data.identity = { email: data.email };
    if (available) {
      loadTemplate('/static/views/onboarding/pool/register.hbs', { data }, (html) => {
        $('#poolPart').html(html);
      });
    } else {
      loadTemplate('/static/views/onboarding/pool/add_post.hbs', { data }, (html) => {
        $('#poolPart').html(html);
      });
    }
  });
});

function  emailIsAvailable(email)
{
  return new Promise(resolve => {
    $.get(`/api/user/emailAvailable/${email}`, (res) => {
      resolve(res.available);
    }).catch(error => errorsHandler(error));
  })
}