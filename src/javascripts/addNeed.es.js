need.firstSearch = true;
need.notifyCandidates = false;
$(`#post`).autocomplete({
  source: list,
  minLength: 2,
  select: (event, ui) => {
    need.post = ui.item.label;
    if (need.firstSearch) return showContractModal();
    else return searchCandidates();
  },
});

$('#searchCandidates').on('click', function () {
  need.post = $('input#post').val();
  searchCandidates();
});

$('input#post').on('keydown', function (e) {
  if (e.which === 13) {
    e.preventDefault();
    need.post = $('input#post').val();
    searchCandidates();
  }
});

let searchCandidates = () => {
  // if ($('input#post').val().length < 2) {
  if (need.filterQuery.length > 1) {
    notification({
      icon: 'exclamation',
      type: 'danger',
      title: 'Veuillez au moins saisir un nom de poste.',
    });
  }
  // }
  need.post = need.post || $('input#post').val();
  if (need.firstSearch) {
    return showContractModal();
  } else {
    $.post(`/api/es/${esId}/search/candidates`, need, (data) => {
      loadTemplate('/static/views/api/searchCandidates.hbs', data, html => {
        $('#resetSearch').show();
        $('#searchResult').html(html).show();
        $('#baseResult').hide();
      });
    }).catch(error => errorsHandler(error));
  }
};

let showServiceModal = () => {
  createModal({
    id: 'serviceType',
    modal: 'es/need/serviceType',
    title: 'Type de service souhaité',
  }, () => {
  });
};

let showContractModal = () => {
  createModal({
    id: 'contractType',
    modal: 'es/need/contractType',
    title: 'Type de contrat souhaité',
  }, () => {
  });
};

let showTimeModal = () => {
  createModal({
    id: 'timeType',
    modal: 'es/need/timeType',
    title: 'Période',
    contractType: need.filterQuery.contractType
  });
};

let showDiplomaModal = () => {
  createModal({
    id: 'diplomaType',
    modal: 'es/need/diplomaType',
    title: 'Diplôme',
  });
};

let resetSearch = () => {
  $('input#post').val('');
  $('#cvCount').text(baseCVCount);
  $('#searchResult').empty().hide();
  $('#baseResult').show();
  $('#btnContractType').empty();
  $('#btnTimeType').empty();
  need.firstSearch = true;
  $('#resetSearch').hide();
};

let addCandidate = (id, type) => {
  id = parseInt(id);
  switch (type) {
    case 'select':
      if (need.selectedCandidates.indexOf(id) === -1) {
        if (need.selectedCandidates.length === 0) $('#saveNeed').show();
        $(`i.selectCandidate[data-id="${id}"]`).hide();
        $(`i.unselectCandidate[data-id="${id}"]`).show();
        need.selectedCandidates.push(id);
        /*$('#selectedEsCount').html(need.selectedCandidates.length);
        $('#es_selected').append($(`#es${id}`).clone().attr('class', 'col-md-3'));*/
      }
      break;
    case 'favorite':
      $(`i.favCandidate[data-id="${id}"]`).css('color', 'gold').attr('onclick', `removeCandidate(${id}, 'unfav')`);
      $.post(`/api/es/${esId}/candidate/${id}/fav/`, { _csrf }, (data) => {
        if (data.status === 'Created') {
          $(`div[data-card-user="${id}"]`).attr('data-favorite', 'true');
          notification({
            icon: 'check-circle',
            type: 'success',
            title: 'Candidat ajouté au favoris.'
          })
        } else {
          notification({
            icon: 'exclamation-circle',
            type: 'warning',
            title: 'Ce candidat est déjà dans vos favoris.'
          })
        }
      });
      break;
    case 'archive':
      createModal({
        id: 'archivateCandidateModal',
        modal: 'es/showArchivateCandidate',
        title: 'Archiver un candidat',
      }, () => {
        $('#archivateCandidate').click(function () {
          $('#archivateCandidateModal').modal('hide');
          $.post(`/api/es/${esId}/candidate/${id}/archive/`, { _csrf }, (data) => {
            if (data.status === 'Created') {
              $(`div[data-card-user="${id}"]`).attr('data-archived', 'true').hide();
              notification({
                icon: 'check-circle',
                type: 'success',
                title: 'Candidat archivé avec succès.'
              })
            } else {
              notification({
                icon: 'exclamation-circle',
                type: 'warning',
                title: 'Ce candidat est déjà archivé.'
              })
            }
          });
        });
      });
      break;
  }
};

let removeCandidate = (id, type) => {
  id = parseInt(id);
  let index;
  switch (type) {
    case 'unselect':
      index = need.selectedCandidates.indexOf(id);
      if (index !== -1) {
        $(`i.unselectCandidate[data-id="${id}"]`).hide();
        $(`i.selectCandidate[data-id="${id}"]`).show();
        need.selectedCandidates.splice(index, 1);
        if (need.selectedCandidates.length === 0) $('#saveNeed').hide();
        /* $('#selectedEsCount').html(need.selectedCandidates.length);
         $(`#es_selected > #es${id}`).remove();*/
      }
      break;
    case 'unfav':
      $(`i.favCandidate[data-id="${id}"]`).css('color', 'inherit').attr('onclick', `addCandidate(${id}, 'favorite')`);
      $.post(`/api/es/${esId}/candidate/${id}/unfav/`, { _csrf }, (data) => {
        if (data.status === 'deleted') {
          $(`div[data-card-user="${id}"]`).attr('data-favorite', 'false');
          notification({
            icon: 'check-circle',
            type: 'success',
            title: 'Candidat supprimé de vos favoris.'
          })
        }
      });
      break;
  }
};

let showArchived = () =>{
  if($('#showArchived').hasClass('Show')) {
    $('div[data-archived="false"]').hide();
    $('div[data-archived="true"]').show();
    $('#showArchived').removeClass('Show').addClass('Hide').css('color', '#0ecea4');
  } else {
    $('div[data-archived="true"]').hide();
    $('div[data-archived="false"]').show();
    $('#showArchived').removeClass('Hide').addClass('Show').css('color', 'black');
  }
};

let showFavorites = () => {
  if($('#showFavorites').hasClass('Show')) {
    $('div[data-favorite="false"][data-archived="false"]').hide();
    $('div[data-favorite="true"][data-archived="false"]').show();
    $('#showFavorites').removeClass('Show').addClass('Hide').css('color', 'gold');
  } else {
    $('div[data-favorite="true"][data-archived="false"]').show();
    $('div[data-favorite="false"][data-archived="false"]').show();
    $('#showFavorites').removeClass('Hide').addClass('Show').css('color', 'black');
  }
};

$(document).ready(() => {
  need._csrf = _csrf;

  $('button#saveNeed').click(function () {
    createModal({
      id: 'needNameModal',
      title: 'Définir un libellé de recherche.',
      modal: 'es/need/defineName',
      cantBeClose: true
    })
  });
});