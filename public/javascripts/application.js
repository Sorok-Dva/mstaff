$('.removeWish').click(function() {
  let id = $(this).attr('data-id') || $(this).parent().attr('data-id');
  $('#btnRemoveWish').attr('onclick', `removeWish(${id})`);
  $("#removeWishModal").modal();
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