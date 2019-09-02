let logoSelected = () => {
  let file = document.querySelector('[type=file]').files[0];
  let formData = new FormData();
  let format = file.type.split('/')[1];
  if (!['jpeg', 'jpg', 'png'].includes(format)) {
    notification({
      icon: 'exclamation',
      type: 'danger',
      title: `Seul les formats jpeg, jpg et png sont autorisés.`
    });
    return false;
  }
  formData.append('logo', file, file.name);

  jQuery.ajax({
    url: `/api/es/job_board/offer/${offer.id}/add/logo?_csrf=${offer.csrfToken}`,
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    type: 'POST',
    success: (data) => {
      if (data.result === 'saved') {
        notification({
          icon: 'check-circle',
          type: 'success',
          title: 'Le logo a été sauvegardé.'
        });
        if (offer) offer.context_section.logo = data.logo;
        $('#contextLogo').attr('src', data.logo);
      }
    },
  }).catch((xhr, status, error) => catchError(xhr, status, error));
};