dragula([
  document.getElementById('1'),
  document.getElementById('2'),
  document.getElementById('3')
], {
  accepts: (el, target, source) =>
    !(($(source).attr('id') === '2' && $(target).attr('id') === '1')
      || ($(source).attr('id') === '1' && $(target).attr('id') === '3') || $(source).attr('id') === '3')
}).on('drag', (el, item) => el.classList.add('is-moving'))
  .on('dragend', (el) => {
    // remove 'is-moving' class from element after dragging has stopped
    el.classList.remove('is-moving');

    // add the 'is-moved' class for 1000ms then remove it
    window.setTimeout(function () {
      el.classList.add('is-moved');
      window.setTimeout(function () {
        el.classList.remove('is-moved');
      }, 600);
    }, 100);
  })
  .on('drop', (item, target, _source, _currentSibling) => {
    let trg = $(target).attr('id');
    let src = $(_source).attr('id');
    let showWarningNotify = localStorage.getItem('showWarningNotifyCandidate') || 'true';
    let showWarningSelect = localStorage.getItem('showWarningSelectCandidate') || 'true';
    if (src === '1' && trg === '2') {
      if (showWarningNotify === 'true') {
        createModal({
          id: 'warningNotifyCandidateModal',
          modal: 'es/warningNotifyCandidate',
          cantBeClose: true,
          title: 'Vous êtes sur le point de notifier un candidat'
        }, () => {
          $('button#notifyCandidate').click(function () {
            $('#warningNotifyCandidateModal').modal('hide');
            if ($('input#showWarningNotifyCandidate').prop('checked')) {
              localStorage.setItem('showWarningNotifyCandidate', 'false');
            }
            showNotifyCandidateModal(item, target);
          });
          $('button#cancelNotifyCandidate').click(function () {
            $(target).children(item).remove();
            $(_source).append(item);
          });
        });
      } else {
        showNotifyCandidateModal(item, target);
      }
    }
    if (src === '2' && trg === '3') {
      if (showWarningSelect === 'true') {
        createModal({
          id: 'warningSelectCandidateModal',
          modal: 'es/warningSelectCandidate',
          cantBeClose: true,
          title: 'Vous êtes sur le point de sélectionner un candidat'
        }, () => {
          $('button#selectCandidate').click(function () {
            $('#warningSelectCandidateModal').modal('hide');
            if ($('input#showWarningSelectCandidate').prop('checked')) {
              localStorage.setItem('showWarningSelectCandidate', 'false');
            }
            selectCandidate(item, target);
          });
          $('button#cancelSelectCandidate').click(function () {
            $(target).children(item).remove();
            $(_source).append(item);
          });
        });
      } else selectCandidate (item, target);
    }
  });

let showNotifyCandidateModal = (item, target) => {
  let needId = $(item).attr('data-needid');
  let cID = $(item).attr('data-candidateid');
  createModal(showNotifyModalObject, () => {
    $('button#notifyCandidate').click(function () {
      let message = $('textarea#notifyMessage').val();
      $.post(`/api/es/${esId}/need/${needId}/notify/candidate/${cID}`, { _csrf, message }, result => {
        if (result.notified) {
          $('#showNotifyCandidateModal').modal('hide');
          notification({
            icon: 'check-circle',
            type: 'success',
            title: 'Candidat notifié :',
            message: `Le candidat vient d'être notifié.`
          });
        }
        $(target).attr('data-status', result.status);
      }).catch(err => errorsHandler(err));
    });
  });
};

let selectCandidate = (item, target) => {
  let needId = $(item).attr('data-needid');
  let cID = $(item).attr('data-candidateid');
  $.post(`/api/es/${esId}/need/${needId}/select/candidate/${cID}`, { _csrf }, result => {
    if (result.notified) {
      notification({
        icon: 'check-circle',
        type: 'success',
        title: 'Candidat sélectionné :',
        message: `Le candidat vient d'être enregistrer comme séléctionné.`
      });
    }
    $(target).attr('data-status', result.status);
  }).catch(err => errorsHandler(err));
};

let removeCandidate = (needId, cID) => {
  $.post(`/api/es/${esId}/need/${needId}/delete/candidate/${cID}`, { _csrf }, result => {
    if (result.status === 'deleted') {
      notification({
        icon: 'check-circle',
        type: 'success',
        title: 'Candidat supprimé :',
        message: `Le candidat vient d'être supprimer de ce besoin.`
      });
      $(`li[data-candidateid="${cID}"]`).remove();
    }
  }).catch(err => errorsHandler(err));
};

$(document).ready(() => {
  $('i[data-action="remove"]').click(function() {
    let showWarningRemove = localStorage.getItem('showWarningRemoveCandidate') || 'true';
    let needId = $(this).closest('li').attr('data-needid');
    let cID = $(this).closest('li').attr('data-candidateid');
    if (showWarningRemove === 'true') {
      createModal({
        id: 'warningRemoveCandidateModal',
        modal: 'es/warningRemoveCandidate',
        cantBeClose: true,
        title: 'Vous êtes sur le point de retirer un candidat'
      }, () => {
        $('button#deleteCandidate').click(function () {
          $('#warningRemoveCandidateModal').modal('hide');
          if ($('input#showWarningRemoveCandidate').prop('checked')) {
            localStorage.setItem('showWarningRemoveCandidate', 'false');
          }
          removeCandidate(needId, cID);
        });
      });
    } else removeCandidate(needId, cID);
  });
});
