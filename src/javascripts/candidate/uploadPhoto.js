let avatarSelected = () => {
  $('#validateAvatarButton').click()
};

$(document).ready(() => {
  $('#avatarForm').on('submit', (e) => {
    e.preventDefault();
    let files = document.querySelector('[type=file]').files;
    let formData = new FormData();
    let format = files[0].type.split('/')[1];
    if (!['jpeg', 'jpg', 'png'].includes(format)) {
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: `Seul les formats jpeg, jpg et png sont autorisés.`
      });
      return false;
    }
    formData.append('photo', files[0], files[0].name);
    jQuery.ajax({
      url: $('#avatarForm').attr('action'),
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      type: 'POST',
      success: (data) => {
        if (data === 'saved') {
          notification({
            icon: 'check-circle',
            type: 'success',
            title: 'Photo de profil sauvegardée !'
          });
          if (isWelcomePage) {
            $('#avatarUpload').hide();
            $('#docUpload').show();
          }
        }
      },
    }).catch((xhr, status, error) => catchError(xhr, status, error));
  });

  $(document).on('change', '.btn-file :file', () => {
    let input = $(this),
      label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [label]);
  });

  $('.btn-file :file').on('fileselect', (event, label) => {
    let input = $(this).parents('.input-group').find(':text'),
      log = label;
  });

  function readURL(input) {
    if (input.files && !_.isNil(input.files[0])) {
      let format = input.files[0].type.split('/')[1];
      if (!['jpeg', 'jpg', 'png'].includes(format)) {
        return false;
      }
      let reader = new FileReader();

      reader.onload = (e) => {
        $('#candidateAvatar').attr('src', e.target.result);
        $('.avatar-img').attr('src', e.target.result);
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  $("#imgInp").change(function () {
    readURL(this);
  });
});