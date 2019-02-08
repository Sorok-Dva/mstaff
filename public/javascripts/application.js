$('.removeWish').click(function() {
  let id = $(this).attr('data-id') || $(this).parent().attr('data-id');
  $('#btnRemoveWish').attr('onclick', `removeWish(${id})`);
  $("#removeWishModal").modal();
});
$('.editWish').click(function () {
  let id = $(this).attr('data-id') || $(this).parent().attr('data-id');
  getWish(`${id}`);
});

let removeWish = (id) => {
  let _csrf = $('#csrfToken').val();
  $.delete(`/api/candidate/wish/${id}`, {_csrf}, (data) => {
    if (data.deleted) {
      notification({
        icon: 'check-circle',
        type: 'success',
        title: 'Candidature supprimée avec succès.',
        message: ``
      });
      $(`tr[data-applicationid="${id}"]`).remove();
    }
  }).catch(error => {
    error = error.responseJSON;
    if (error !== undefined && error.error === 'Not exists') {
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Suppression impossible',
        message: `Erreur lors de la suppression de la candidature.`
      });
    } else return errorsHandler(error);
  });
};

let getWish = (id) => {
  console.log('ID = '.concat(id));
  let _csrf = $('#csrfToken').val();
  $.get(`/api/candidate/wish/${id}`, {_csrf}, (data) => {
    if (data.get)
      console.log(data.wish);
  }).catch(error => {
    error = error.responseJSON;
    if (error !== undefined && error.error === 'Not exists') {
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Modification impossible',
        message: `Erreur lors de la modification de la candidature.`
      });
    } else return errorsHandler(error);
  });
};