let loadingCandidateHTML = $('#loadingCandidates').html();
let showSelectAllSearchInfo = localStorage.getItem('showSelectAllSearchInfo') || 'true';
need.notifyCandidates = false;

let accentMap = {
  'à': 'a',
  'â': 'a',
  'é': 'e',
  'É': 'E',
  'è': 'e',
  'ê': 'e',
  'ë': 'e',
  'ï': 'i',
  'î': 'i',
  'ô': 'o',
  'ö': 'o',
  'û': 'u',
  'ù': 'u'
};

let normalize = (term) => {
  let ret = "";
  for (let i = 0; i < term.length; i++) {
    ret += accentMap[term.charAt(i)] || term.charAt(i);
  }
  return ret;
};
let split = (val) => val.split(/,\s*/);
let extractLast = (term) => split(term).pop();

$(`#post`).autocomplete({
  source: (request, response) => {
    let matcher = new RegExp($.ui.autocomplete.escapeRegex(extractLast(request.term)), "i");
    response($.grep(list, (value) => {
      value = value.value || value;
      return matcher.test(value) || matcher.test(normalize(value));
    }));
  },
  minLength: 2,
  select: (event, ui) =>  {
    let terms = split(this.value);
    // remove the current input
    terms.pop();
    // add the selected item
    terms.push( ui.item.value );
    // add placeholder to get the comma-and-space at the end
    terms.push('');
    this.value = terms.join(', ');
    need.post = ui.item.label;
    return searchCandidates();
  },
  focus: () => false
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
  $('#baseResult').hide();
  $('#paginationContainer').hide();
  $('#searchResult').html(loadingCandidateHTML.replace('vos candidats', 'votre recherche')).show();
  $.post(`/api/es/${esId}/search/candidates`, need, (data) => {
    data.partials = ['candidatePercentageTooltip'];
    loadTemplate('/static/views/api/searchCandidates.hbs', data, html => {
      $('#resetSearch').show();
      $('#searchResult').html(html).show();
      $('#searchCount').html(`${data.length} résultats pour votre recherche.`).show();
      $('#selectAllSearch').show();
    });
  }).catch(error => errorsHandler(error));
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

let showAvailabilityModal = () => {
  createModal({
    id: 'availabilityType',
    modal: 'es/need/availabilityType',
    title: 'Disponibilité',
    checked: need.filterQuery.is_available
  });
};

let showPostalCodeModal = () => {
  createModal({
    id: 'postalCodeType',
    modal: 'es/need/postalCodeType',
    title: 'Code Postal',
    postalCode: need.filterQuery.postal_code
  });
};

let resetSearch = () => {
  let esSave = need.filterQuery.establishments;
  delete need.filterQuery;
  need.filterQuery = { establishments: esSave };
  $('input#post').val('');
  $('#cvCount').text(baseCVCount);
  $('#resetSearch').hide();
  $('#searchCount').empty().hide();
  $('#selectAllSearch').hide();
  $('#searchResult').empty().hide();
  $('#baseResult').show();
  $('#paginationContainer').show();
  $('#btnServiceType').empty();
  $('#btnContractType').empty();
  $('#btnTimeType').empty();
  $('#btnDiplomaType').empty();
  $('#btnAvailability').empty();
  $('#btnPostalCode').empty();
  $('#btnServiceType').parent().removeClass('btn-info').addClass('btn-outline-info');
  $('#btnContractType').parent().removeClass('btn-info').addClass('btn-outline-info');
  $('#btnDiplomaType').parent().removeClass('btn-info').addClass('btn-outline-info');
  $('#btnAvailability').parent().removeClass('btn-info').addClass('btn-outline-info');
  $('#btnPostalCode').parent().removeClass('btn-info').addClass('btn-outline-info');
  $('#btnTimeType').parent().removeClass('btn-info').addClass('btn-outline-info');
};

let selectAllSearch = () => {
  if (showSelectAllSearchInfo === 'true') {
    createModal({
      id: 'infoSelectAllCandidatesModal',
      modal: 'es/infoSelectAllCandidates',
      title: 'Sélectionner tous les candidats'
    }, () => {
      $('button#SelectAllCandidate').click(function () {
        showSelectAllSearchInfo = 'false';
        localStorage.setItem('showSelectAllSearchInfo', 'false');
        $('#infoSelectAllCandidatesModal').modal('hide');
        let toSelect = $('#searchResult .selectCandidate:visible');
        toSelect.each((i, element) => (i < 50) ? $(element).trigger('click') : false);
      });
      $('button#cancelSelectAllCandidate').click(function () {
       $('#searchSelectAll').trigger('click');
      });
    });
  } else {
    let toSelect = $('#searchResult .selectCandidate:visible');
    toSelect.each((i, element) => (i < 50) ? $(element).trigger('click') : false);
  }
};
let unselectAllSearch = () => $('#searchResult .unselectCandidate:visible').trigger('click');

let addCandidate = (id, type) => {
  id = parseInt(id);
  switch (type) {
    case 'select':
      if (need.selectedCandidates.indexOf(id) === -1) {
        if (need.selectedCandidates.length < 50) {
          if (need.selectedCandidates.length === 0) $('#saveNeed').show();
          $(`i.selectCandidate[data-id="${id}"]`).hide();
          $(`i.unselectCandidate[data-id="${id}"]`).show();
          need.selectedCandidates.push(id);
          $('#saveNeed').attr('data-original-title', `Enregister ma recherche (${need.selectedCandidates.length} candidat sélectionnés)`);
          $('#searchCount').prepend(``)
        } else {
          notification({
            icon: 'exclamation-circle',
            type: 'warning',
            title: 'Vous ne pouvez pas séléctionner plus de 50 candidats sur un besoin.'
          })
        }
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
              $(`i.archiveCandidate[data-id="${id}"]`).css('color', 'rgb(14, 206, 164)').attr('onclick', `removeCandidate(${id}, 'unarchive')`);
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
    case 'unarchive':
      $(`i.archiveCandidate[data-id="${id}"]`).css('color', 'inherit').attr('onclick', `addCandidate(${id}, 'archive')`);
      $.post(`/api/es/${esId}/candidate/${id}/unarchive/`, { _csrf }, (data) => {
        if (data.status === 'deleted') {
          $(`#myCandidates div[data-card-user="${id}"]`).remove();
          $(`div[data-card-user="${id}"]`).attr('data-archived', 'false').show();
          notification({
            icon: 'check-circle',
            type: 'success',
            title: 'Candidat retiré de vos archives.'
          })
        }
      });
      break;
  }
};

let showArchived = () =>{
  if($('#showArchived').hasClass('Show')) {
    if ($('#showFavorites').hasClass('Hide')) {
      showFavorites();
    }
    $.post(`/api/es/${esId}/candidates/archived/`, { _csrf }, (data) => {
      $('#showArchived').removeClass('Show').addClass('Hide').css('color', '#0ecea4');
      data.partials = ['candidatePercentageTooltip'];
      loadTemplate('/static/views/api/showMyCandidates.hbs', data, html => {
        $('#baseResult').hide();
        $('#searchResult').hide();
        $('#paginationContainer').hide();
        $('#myCandidates').html(html).show();
        $('#searchCount').html(`${data.length} candidats archivés.`).show();
        $('#selectAllSearch').show();
      });
    }).catch(errors => errorsHandler(errors));
  } else {
    $('#myCandidates').empty().hide();
    $('#showArchived').removeClass('Hide').addClass('Show').css('color', '#9e9e9e');
    if ($('#searchResult').text().length === 0) {
      $('#baseResult').show();
      $('#searchResult').hide();
      $('#paginationContainer').show();
      $('#searchCount').empty().hide();
      $('#selectAllSearch').hide();
    } else {
      $('#baseResult').hide();
      $('#searchResult').show();
      $('#paginationContainer').hide();
    }
  }
};

let showFavorites = () => {
  if($('#showFavorites').hasClass('Show')) {
    if ($('#showArchived').hasClass('Hide')) {
      showArchived();
    }
    $.post(`/api/es/${esId}/candidates/favorites/`, { _csrf }, (data) => {
      $('#showFavorites').removeClass('Show').addClass('Hide').css('color', 'gold');
      data.partials = ['candidatePercentageTooltip'];
      loadTemplate('/static/views/api/showMyCandidates.hbs', data, html => {
        $('#baseResult').hide();
        $('#searchResult').hide();
        $('#paginationContainer').hide();
        $('#myCandidates').html(html).show();
        $('#searchCount').html(`${data.length} candidats favoris.`).show();
        $('#selectAllSearch').show();
      });
    }).catch(errors => errorsHandler(errors));
  } else {
    $('#showFavorites').removeClass('Hide').addClass('Show').css('color', '#9e9e9e');
    if ($('#searchResult').text().length === 0) {
      $('#baseResult').show();
      $('#searchResult').hide();
      $('#paginationContainer').show();
      $('#searchCount').empty().hide();
      $('#selectAllSearch').hide();
    } else {
      $('#baseResult').hide();
      $('#searchResult').show();
      $('#paginationContainer').hide();
    }
    $('#myCandidates').empty().hide();
  }
};

$(document).ready(() => {
  need._csrf = _csrf;

  $('input#searchSelectAll').change(function () {
    if (this.checked) selectAllSearch();
    else unselectAllSearch();
  });

  if(Math.round(baseCVCount / size) > 0) {
    $('.pagination').twbsPagination({
      totalPages: Math.round(baseCVCount / size),
      visiblePages: 4,
      first: '<i class="fal fa-chevron-double-left"></i>',
      prev: '<i class="fal fa-chevron-left"></i>',
      next: '<i class="fal fa-chevron-right"></i>',
      last: '<i class="fal fa-chevron-double-right"></i>',
      pageClass: 'page-item',
      anchorClass: 'page-link',
      onPageClick: function (event, page) {
        $('#baseResult').empty().html(loadingCandidateHTML);
        $.post(`/api/es/${esId}/paginate/candidates/${page}/${size}`, {_csrf}, (data) => {
          data.partials = ['candidatePercentageTooltip'];
          loadTemplate('/static/views/api/showCandidatesPagination.hbs', data, html => {
            $('#baseResult').empty().html(html);
          });
        }).catch(errors => errorsHandler(errors));
      }
    });
  } else {
    $.post(`/api/es/${esId}/paginate/candidates/1/${size}`, {_csrf}, (data) => {
      data.partials = ['candidatePercentageTooltip'];
      loadTemplate('/static/views/api/showCandidatesPagination.hbs', data, html => {
        $('#baseResult').empty().html(html);
      });
    }).catch(errors => errorsHandler(errors));
  }

  $('button#saveNeed').click(function () {
    if ($(this).is("[data-need-id]")) {
      createModal({
        id: 'needNameModal',
        title: 'Renommer votre recherche',
        modal: 'es/need/defineName',
        cantBeClose: true,
        context: { need }
      })
    } else {
      createModal({
        id: 'needNameModal',
        title: 'Définir un libellé de recherche.',
        modal: 'es/need/defineName',
        cantBeClose: true
      })
    }
  });
});