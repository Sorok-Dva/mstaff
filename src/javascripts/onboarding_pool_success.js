function notify(error){
  if (error === 'creationError') {
    notification({
      icon: 'exclamation',
      type: 'danger',
      title: 'Erreur :',
      message: `Une erreur est survenue durant la création de votre compte.`
    });
  }
  return false;
}

function assignUserToPool(infoToSend) {
  $.post(`/invitation/pool/${data.token}`, infoToSend, (affiliated) => {
    if(affiliated === "user affiliated to pool")
    {
      loadTemplate('/static/views/onboarding/pool/success.hbs', { data }, (html) => {
        $('#poolPart').html(html);
      });
    }
  }).catch(() => { notify('creationError');});
}

function  createUser() {
  let _csrf = $('meta[name="csrf-token"]').attr('content');
  let infoToSend = {
    email: data.identity.email,
    _csrf: _csrf,
    pool_id: data.pool_id,
    data: {
      post: data.post,
      services: data.services,
      availability: data.availability
    }
  };

  if (!data.emailExist) {
    data.identity._csrf = _csrf;
    $.post(`/register`, data.identity, (userCreated) => {
      if (userCreated.result === "created")
        assignUserToPool(infoToSend);
      else
        notify('creationError');
    }).catch(() => notify('creationError'));
  } else {
    return assignUserToPool(infoToSend);
  }
}