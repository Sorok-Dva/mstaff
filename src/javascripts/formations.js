$('.add').click(function () {
  let stop = false, formData = {}, type = $(this).attr('data-type'), formArray = $(`#${type}`).serializeArray();
  $.each(formArray, (i, field) => formData[field.name] = field.value);
  if (type === 'experience') {
    formData.current = formData.current === 'on';
    formData.internship = formData.internship === 'on';
  }
  formData.start = new Date(formData.start.split('/')[1], formData.start.split('/')[0] - 1);
  formData.end = new Date(formData.end.split('/')[1], formData.end.split('/')[0] - 1);
  formData._csrf = $('#csrfToken').val();
  if (isNaN(formData.start.getTime())) {
    notification(
      {
        icon: 'exclamation',
        type: 'danger',
        title: 'Champ invalide :',
        message: `Vous devez indiquer une date de début valide.`
      }
    );
    stop = true;
  }
  if (type === 'experience') {
    if (formData.name === '' || null) {
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Champ invalide :',
        message: `Vous devez indiquer une nom pour votre expérience.`
      });
      stop = true
    }
    if (!formData.current && isNaN(formData.end.getTime())) {
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Champ invalide :',
        message: `Vous devez indiquer une date de fin valide.`
      });
      stop = true
    }
  } else if (type === 'formation' || 'diploma') {
    if (isNaN(formData.end.getTime())) {
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Champ invalide :',
        message: `Vous devez indiquer une date de fin valide.`
      });
      stop = true
    }
  }
  if (!stop) {
    if (isNaN(formData.end.getTime())) formData.end = null;
    $.post(`/add/${type}`, formData, (data) => {
      $(`form#${type}`).trigger('reset');
      if (type === 'experience') {
        if (data.experience) {
          notification({
            icon: 'check-circle',
            type: 'success',
            title: 'Expérience ajoutée avec succès :',
            message: `Votre expérience nommée "${data.experience.name}" vient d'être ajoutée à votre profil.`
          });
          let start = moment(new Date(data.experience.start)).format('MM/YYYY');
          let end = data.experience.current ? 'maintenant' : moment(new Date(data.experience.end)).format('MM/YYYY');
          let internship = data.experience.internship ? '<small>(stage)</small>' : '';
          if ($('.noXPAvailable').is(':visible')) $('.noXPAvailable').remove();
          $('#experienceTbody').append($('<tr>')
            .attr('data-xpId', data.experience.id)
            .append($('<td>').html(`${start} - ${end} ${internship}`))
            .append($('<td>').text(`${data.experience.name}`))
            .append($('<td>').text(`${data.experience.poste.name}`))
            .append($('<td>').append($('<label>').attr('class', 'label label-warning').text(`${data.experience.service.name}`)))
            .append($('<td>').append($('<button>').attr({
              class: 'btn btn-simple btn-warning btn-icon editXP',
              'data-id': data.experience.id
            }).html('<i class="ti-pencil-alt"></i>'))
              .append($('<button>').attr({
                class: 'btn btn-simple btn-danger btn-icon removeXP',
                'data-id': data.experience.id
              }).html('<i class="ti-close"></i>')))
          );
        }
      }
      else if (type === 'formation') {
        if (data.formation) {
          notification({
            icon: 'check-circle',
            type: 'success',
            title: 'Formation ajoutée avec succès :',
            message: `Votre formation nommée "${data.formation.name}" vient d'être ajoutée à votre profil.`
          });
          let start = moment(new Date(data.formation.start)).format('MM/YYYY');
          let end = !data.formation.end ? 'maintenant' : moment(new Date(data.formation.end)).format('MM/YYYY');
          if ($('.noFormationAvailable').is(':visible')) $('.noFormationAvailable').remove();
          $('#formationsTbody').append($('<tr>')
            .attr('data-formationId', data.formation.id)
            .append($('<td>').html(`${start} - ${end}`))
            .append($('<td>').text(`${data.formation.name}`))
            .append($('<td>').append($('<button>').attr({
              class: 'btn btn-simple btn-warning btn-icon editFormation',
              'data-id': data.formation.id
            }).html('<i class="ti-pencil-alt"></i>'))
              .append($('<button>').attr({
                class: 'btn btn-simple btn-danger btn-icon removeFormation',
                'data-id': data.formation.id
              }).html('<i class="ti-close"></i>')))
          );
        }
      }
      else if (type === 'diploma') {
        if (data.diploma) {
          notification({
            icon: 'check-circle',
            type: 'success',
            title: 'Diplôme ajoutée avec succès :',
            message: `Votre diplôme nommée "${data.diploma.name}" vient d'être ajouté à votre profil.`
          });
          let start = moment(new Date(data.diploma.start)).format('MM/YYYY');
          let end = !data.diploma.end ? 'maintenant' : moment(new Date(data.diploma.end)).format('MM/YYYY');
          if ($('.noDiplomaAvailable').is(':visible')) $('.noDiplomaAvailable').remove();
          $('#diplomaTbody').append($('<tr>')
            .attr('data-diplomaId', data.diploma.id)
            .append($('<td>').html(`${start} - ${end}`))
            .append($('<td>').text(`${data.diploma.name}`))
            .append($('<td>').append($('<button>').attr({
              class: 'btn btn-simple btn-warning btn-icon editDiploma',
              'data-id': data.diploma.id
            }).html('<i class="ti-pencil-alt"></i>'))
              .append($('<button>').attr({
                class: 'btn btn-simple btn-danger btn-icon removeDiploma',
                'data-id': data.diploma.id
              }).html('<i class="ti-close"></i>')))
          );
        }

      }
    }).catch(errors => errorsHandler(errors));
  }
});

$('#service_id').select2();
$('#post_id').select2();

$('body').on('click', 'button.removeXP', (event) => {
  let id = $(event.target).attr('data-id') || $(event.target).parent().attr('data-id');
  createModal({
    modal: 'removeExperience',
    id: 'removeExperienceModal',
    title: 'Supprimer cette experience ?'
  }, () => {
    $('#btnRemoveXp').attr('onclick', `removeCandidateExperience(${id})`);
  })
}).on('click', 'button.removeFormation', (event) => {
  let id = $(event.target).attr('data-id') || $(event.target).parent().attr('data-id');
  $('#btnRemoveFormation').attr('onclick', `removeCandidateFormation(${id})`);
  $('#removeFormationModal').modal();
}).on('click', 'button.removeDiploma', (event) => {
  let id = $(event.target).attr('data-id') || $(event.target).parent().attr('data-id');
  $('#btnRemoveDiploma').attr('onclick', `removeCandidateDiploma(${id})`);
  $('#removeDiplomaModal').modal();
}).on('click', 'button.editXP', (event) => {
  let id = $(event.target).attr('data-id') || $(event.target).parent().attr('data-id');
  $.get(`/api/candidate/xp/${id}`, (data) => {
    if (data.experience) {
      let start = new Date(data.experience.start);
      let end = data.experience.end === null ? null : new Date(data.experience.end);

      $('#editName').val(data.experience.name);
      $('#editPost_id').val(data.experience.poste_id);
      $('#editService_id').val(data.experience.service_id);
      $('#editStart').val(`${('0' + (start.getMonth() + 1)).slice(-2)}/${start.getFullYear()}`);
      $('#editInternship').prop('checked', !!data.experience.internship);
      $('#editCurrent').prop('checked', !!data.experience.current);

      if (end === null) {
        $('#editEnd').prop('disabled', true);
      } else {
        $('#editEnd').prop('disabled', false);
        $('#editEnd').val(`${('0' + (end.getMonth() + 1)).slice(-2)}/${end.getFullYear()}`);
      }
      $('#editXpModal').modal();
      $('#editXPId').val(id);
      $('#editXP').attr('onclick', `editXP(${id})`);
    }
  }).catch(errors => {
    notification({
      icon: 'exclamation',
      type: 'danger',
      title: 'Une erreur est survenue :',
      message: `Impossible de récupérer les informations de cette experience.`
    });
  });
}).on('click', 'button.editFormation', (event) => {
  let id = $(event.target).attr('data-id') || $(event.target).parent().attr('data-id');
  $.get(`/api/candidate/formation/${id}`, (data) => {
    if (data.formation) {
      createModal({ id: 'editFormationModal', modal: 'editFormation', title: '<span class="ti-pencil-alt"></span> Modifier une formation' }, () => {
        let start = new Date(data.formation.start);
        let end = data.formation.end === null ? null : new Date(data.formation.end);

        $('#editFName').val(data.formation.name);
        $('#editFStart').val(`${('0' + (start.getMonth() + 1)).slice(-2)}/${start.getFullYear()}`);

        if (end === null) {
          $('#editFEnd').prop('disabled', true);
        } else {
          $('#editFEnd').prop('disabled', false);
          $('#editFEnd').val(`${('0' + (end.getMonth() + 1)).slice(-2)}/${end.getFullYear()}`);
        }
        $('#editFormationId').val(id);
        $('#editFormation').attr('onclick', `editFormation(${$('#editFormation').attr('data-id')})`);
      });
    }
  }).catch(errors => {
    notification({
      icon: 'exclamation',
      type: 'danger',
      title: 'Une erreur est survenue :',
      message: `Impossible de récupérer les informations de cette formation.`
    });
  });
}).on('click', 'button.editDiploma', (event) => {
  let id = $(event.target).attr('data-id') || $(event.target).parent().attr('data-id');
  $.get(`/api/candidate/diploma/${id}`, (data) => {
    if (data.diploma) {
      createModal({ id: 'editDiplomaModal', modal: 'editDiploma', title: '<span class="ti-pencil-alt"></span> Modifier un diplôme' }, () => {
        let start = new Date(data.diploma.start);
        let end = data.diploma.end === null ? null : new Date(data.diploma.end);

        $('#editDName').val(data.diploma.name);
        $('#editDStart').val(`${('0' + (start.getMonth() + 1)).slice(-2)}/${start.getFullYear()}`);

        if (end === null) {
          $('#editDEnd').prop('disabled', true);
        } else {
          $('#editDEnd').prop('disabled', false);
          $('#editDEnd').val(`${('0' + (end.getMonth() + 1)).slice(-2)}/${end.getFullYear()}`);
        }
      });
    }
  }).catch(errors => {
    notification({
      icon: 'exclamation',
      type: 'danger',
      title: 'Une erreur est survenue :',
      message: `Impossible de récupérer les informations de ce diplôme.`
    });
  });
});

let removeCandidateExperience = id => {
  let _csrf = $('#csrfToken').val();
  $.delete(`/api/candidate/xp/${id}`, { _csrf }, (data) => {
    if (data.done) {
      $(`tr[data-xpId="${id}"]`).remove();
      notification({
        icon: 'check-circle',
        type: 'success',
        title: 'Expérience supprimée avec succès :',
        message: `Votre expérience vient d'être supprimée de votre profil.`
      });
    }
  }).catch(errors => {
    notification({
      icon: 'exclamation',
      type: 'danger',
      title: 'Une erreur est survenue :',
      message: `Impossible de supprimer cette experience.`
    });
  });
};

let removeCandidateFormation = id => {
  let _csrf = $('#csrfToken').val();
  $.delete(`/api/candidate/formation/${id}`, { _csrf }, (data) => {
    if (data.done) {
      $(`tr[data-formationId="${id}"]`).remove();
      notification({
        icon: 'check-circle',
        type: 'success',
        title: 'Formation supprimée avec succès :',
        message: `Votre formation vient d'être supprimée de votre profil.`
      });
    }
  }).catch(errors => {
    notification({
      icon: 'exclamation',
      type: 'danger',
      title: 'Une erreur est survenue :',
      message: `Impossible de supprimer cette formation.`
    });
  });
};

let removeCandidateDiploma = id => {
  let _csrf = $('#csrfToken').val();
  $.delete(`/api/candidate/diploma/${id}`, { _csrf }, (data) => {
    if (data.done) {
      $(`tr[data-diplomaId="${id}"]`).remove();
      notification({
        icon: 'check-circle',
        type: 'success',
        title: 'Diplôme supprimée avec succès :',
        message: `Votre diplôme vient d'être supprimé de votre profil.`
      });
    }
  }).catch(errors => {
    notification({
      icon: 'exclamation',
      type: 'danger',
      title: 'Une erreur est survenue :',
      message: `Impossible de supprimer ce diplôme.`
    });
  });
};

let editXP = (id) => {
  let _csrf = $('#csrfToken').val();
  let name = $('#editName').val();
  let poste_id = $('#editPost_id').val();
  let startDate = $('#editStart').val().split('/');
  let endDate = $('#editEnd').val().split('/');
  let start = new Date(startDate[1], startDate[0] - 1);
  let end = new Date(endDate[1], endDate[0] - 1);

  $.put(`/api/candidate/xp/${id}`, {
    name: $('#editFName').val(),
    start,
    end,
    _csrf
  }, (data) => {
    if (data.result === 'updated') {
      notification({
        type: 'success',
        icon: 'check-circle',
        title: 'Formation editée :',
        message: 'Votre formation a correctement été modifiée.'
      })
    } else {
      if (data.errors) {
        errorsHandler(data.errors);
      }
    }
  }).catch(errors => errorsHandler(errors));
};

let editFormation = (íd) => {
  let _csrf = $('#csrfToken').val();
  let startDate = $('#editFStart').val().split('/');
  let endDate = $('#editFEnd').val().split('/');
  let start = new Date(startDate[1], startDate[0] - 1);
  let end = new Date(endDate[1], endDate[0] - 1);
  $.put(`/api/candidate/formation/${$('#editFormationId').val()}`, {
    name: $('#editFName').val(),
    start,
    end,
    _csrf
  }, (data) => {
    if (data.result === 'updated') {
      notification({
        type: 'success',
        icon: 'check-circle',
        title: 'Formation editée :',
        message: 'Votre formation a correctement été modifiée.'
      })
    } else {
      if (data.errors) {
        errorsHandler(data.errors);
      }
    }
  }).catch(errors => errorsHandler(errors));
};