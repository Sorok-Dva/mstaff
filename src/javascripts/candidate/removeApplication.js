$('.removeWish').click(function() {
  createModal({
    id: 'removeWishModal',
    title: 'Confirmation',
    text: 'Êtes-vous sûr de vouloir supprimer ce souhait ?',
    actions: [
      '<button type="button" class="btn btn-default" data-dismiss="modal">Non</button>',
      '<button type="button" id="btnRemoveWish" class="btn btn-danger" data-dismiss="modal">Oui</button>'
    ]
  }, () => {
    let id = $(this).attr('data-id') || $(this).parent().attr('data-id');
    $('#btnRemoveWish').attr('onclick', `removeWish(${id})`);
  });
});

$('.showEsList').click(function() {
  let id = $(this).attr('data-applicationId') || $(this).parent().attr('data-applicationId');
  $.get(`/api/candidate/wish/${id}/getEsList`, {}, (data) => {
    createModal({ id: 'showEsListModal', modal: 'candidate/showEsList', title: 'Liste des établissements séléctionnés', data, wishId: id });
  });
});

let removeWish = (id) => {
  let _csrf = $('meta[name="csrf-token"]').attr('content');
  $.delete(`/api/candidate/wish/${id}`, { _csrf }, (data) => {
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

let removeApplication = (id) => {
  let _csrf = $('meta[name="csrf-token"]').attr('content');
  $.delete(`/api/candidate/wish/${id}/application/`, { _csrf }, (data) => {
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

$(document).ready(() => {
  $('i[data-refreshWish-id]').click(function() {
    let id = $(this).attr('data-refreshWish-id');
    if (confirm(`Voulez vous vraiment réactualiser ce souhait ?`)) {
      $.post(`/api/candidate/wish/${id}/refresh`, { _csrf }, data => {
        if (data.result === 'updated') {
          $(`[data-h4-wishId="${id}"]`).html(`<i class="fal fa-clock" data-wish-id="${id}" style="color: blue"></i> 30 jours`);
          notification({
            icon: 'check-circle',
            type: 'success',
            title: 'Votre souhait a bien été actualisé.',
          });
        }
      }).catch((xhr, status, error) => catchError(xhr, status, error));
    }
  });
});