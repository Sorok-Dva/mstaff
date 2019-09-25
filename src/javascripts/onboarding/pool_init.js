let databaseInfo = {
  posts: {},
  services: {},
  inEs: false,
};

$(document).ready(function () {
  emailIsAvailable(data.email).then(available => {
    data.permissions = {
      checkingMail: null,
      verifiedEvent: new Event('verified')
    };

    data.identity = { email: data.email };
    data.availability = {};
    data.emailExist = !available;
    initVariables().then(() => {
      if (available) {
        loadTemplate('/views/onboarding/pool/register.hbs', { data, databaseInfo }, (html) => {
          $('#poolPart').html(html);
        });
      } else {
        // add_post.hbs
        loadTemplate('/views/onboarding/pool/add_post.hbs', { data, databaseInfo }, (html) => {
          $('#poolPart').html(html);
        });
      }
    });
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

function initVariables()
{
  return new Promise( resolve => {
    $.get(`/api/pool/data/all`, (datas) => {
      databaseInfo.posts = datas.posts;
      databaseInfo.services = datas.services;
      resolve(databaseInfo);
    }).catch(error => errorsHandler(error));
  });
}