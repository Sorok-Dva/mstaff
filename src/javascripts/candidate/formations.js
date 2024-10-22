$('.add').click(function () {
  let stop = false, formData = {}, type = $(this).attr('data-type'), formArray = $(`#${type}`).serializeArray();
  $.each(formArray, (i, field) => formData[field.name] = field.value);
  if (type === 'experience') {
    formData.current = formData.current === 'on';
    formData.internship = formData.internship === 'on';
  }
  formData.start = new Date(formData.start.split('/')[1], formData.start.split('/')[0] - 1);
  formData.end = new Date(formData.end.split('/')[1], formData.end.split('/')[0] - 1);
  formData._csrf = $('meta[name="csrf-token"]').attr('content');
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
              class: 'btn btn-simple btn-outline-warning btn-icon editXP',
              'data-id': data.experience.id,
              type: 'button'
            }).html('<i class="ti-pencil-alt"></i>'))
              .append($('<button>').attr({
                class: 'btn btn-simple btn-outline-danger btn-icon removeXP',
                'data-id': data.experience.id,
                type: 'button'
              }).html('<i class="ti-close"></i>')))
          );
          $('#xpStart').data('DateTimePicker').minDate(false).maxDate(false).viewMode('months');
          $('#xpEnd').data('DateTimePicker').maxDate(false).viewMode('months');
        }
      } else if (type === 'formation') {
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
              class: 'btn btn-simple btn-outline-warning btn-icon editFormation',
              'data-id': data.formation.id,
              type: 'button'
            }).html('<i class="ti-pencil-alt"></i>'))
              .append($('<button>').attr({
                class: 'btn btn-simple btn-outline-danger btn-icon removeFormation',
                'data-id': data.formation.id,
                type: 'button'
              }).html('<i class="ti-close"></i>')))
          );
          $('#fStart').data('DateTimePicker').minDate(false).maxDate(false).viewMode('months');
          $('#fEnd').data('DateTimePicker').maxDate(false).viewMode('months');
        }
      } else if (type === 'diploma') {
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
              class: 'btn btn-simple btn-outline-warning btn-icon editDiploma',
              'data-id': data.diploma.id,
              type: 'button'
            }).html('<i class="ti-pencil-alt"></i>'))
              .append($('<button>').attr({
                class: 'btn btn-simple btn-outline-danger btn-icon removeDiploma',
                'data-id': data.diploma.id,
                type: 'button'
              }).html('<i class="ti-close"></i>')))
          );
          $('#dStart').data('DateTimePicker').minDate(false).maxDate(false).viewMode('months');
          $('#dEnd').data('DateTimePicker').maxDate(false).viewMode('months');
        }
      }
    }).catch((xhr, status, error) => catchError(xhr, status, error));
  }
});
$('body').on('click', 'button.removeXP', (event) => {
  let id = $(event.target).attr('data-id') || $(event.target).parent().attr('data-id');
  createModal({
    id: 'removeExperienceModal',
    title: 'Supprimer cette experience ?',
    text: ' Êtes-vous sûr de vouloir supprimer cette experience ?',
    actions: [
      '<button type="button" class="btn btn-default" data-dismiss="modal">Non</button>',
      `<button type="button" class="btn btn-danger" data-dismiss="modal" onclick="removeCandidateExperience(${id})">Oui</button>`
    ]
  });
}).on('click', 'button.removeFormation', (event) => {
  let id = $(event.target).attr('data-id') || $(event.target).parent().attr('data-id');
  createModal({
    id: 'removeFormationModal',
    title: 'Supprimer cette formation ?',
    text: ' Êtes-vous sûr de vouloir supprimer cette formation ?',
    actions: [
      '<button type="button" class="btn btn-default" data-dismiss="modal">Non</button>',
      `<button type="button" class="btn btn-danger" data-dismiss="modal" onclick="removeCandidateFormation(${id})">Oui</button>`
    ]
  });
}).on('click', 'button.removeDiploma', (event) => {
  let id = $(event.target).attr('data-id') || $(event.target).parent().attr('data-id');
  createModal({
    id: 'removeDiplomaModal',
    title: 'Supprimer ce diplôme ?',
    text: ' Êtes-vous sûr de vouloir supprimer ce diplôme ?',
    actions: [
      '<button type="button" class="btn btn-default" data-dismiss="modal">Non</button>',
      `<button type="button" class="btn btn-danger" data-dismiss="modal" onclick="removeCandidateDiploma(${id})">Oui</button>`
    ]
  });
}).on('click', 'button.editXP', (event) => {
  let id = $(event.target).attr('data-id') || $(event.target).parent().attr('data-id');
  $.get(`/api/candidate/xp/${id}`, (experience) => {
    if (experience) {
      createModal({
        modal: 'candidate/editExperience',
        id: 'editXPModal',
        title: 'Modifier une expérience',
        experience
      });
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
      createModal({
        id: 'editFormationModal',
        modal: 'candidate/editFormation',
        title: '<span class="ti-pencil-alt"></span> Modifier une formation',
        dataID: data.formation.id
      }, () => {
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
      createModal({
        id: 'editDiplomaModal',
        modal: 'candidate/editDiploma',
        title: '<span class="ti-pencil-alt"></span> Modifier un diplôme',
        dataID: data.diploma.id
      }, () => {
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
  let _csrf = $('meta[name="csrf-token"]').attr('content');
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
  let _csrf = $('meta[name="csrf-token"]').attr('content');
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
  let _csrf = $('meta[name="csrf-token"]').attr('content');
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

let editFormation = (id) => {
  let _csrf = $('meta[name="csrf-token"]').attr('content');
  let startDate = $('#editFStart').val().length === 7 ? $('#editFStart').val().split('/') : null;
  let endDate = $('#editFEnd').val().length === 7 ? $('#editFEnd').val().split('/') : null;
  let start = !_.isNil(startDate) ? `${startDate[1]}/${startDate[0]}` : null;
  let end = !_.isNil(endDate) ? `${endDate[1]}/${endDate[0]}` : null;
  if (_.isNil(start) || _.isNil(end)) return notification({
    icon: 'exclamation',
    type: 'danger',
    title: 'Champ invalide :',
    message: `Veuillez vérifier vos dates`
  });
  $.put(`/api/candidate/formation/${id}`, {
    name: $('#editFName').val(),
    start,
    end,
    _csrf
  }, (data) => {
    if (data.result === 'updated') {
      $('#editFormationModal').modal('hide');
      notification({
        icon: 'check-circle',
        type: 'success',
        title: 'Formation mise à jour avec succès.',
        message: `La page va s'actualiser dans quelques secondes.`,
        onClosed: () => $(location).attr('href', `/formations`)
      });
    } else {
      if (data.errors) {
        errorsHandler(data.errors);
      }
    }
  }).catch((xhr, status, error) => catchError(xhr, status, error));
};

let editDiploma = (id) => {
  let _csrf = $('meta[name="csrf-token"]').attr('content');
  let startDate = $('#editDStart').val().split('/');
  let endDate = $('#editDEnd').val().split('/');
  let start = new Date(startDate[1], startDate[0] - 1);
  let end = new Date(endDate[1], endDate[0] - 1);
  $.put(`/api/candidate/diploma/${id}`, {
    name: $('#editDName').val(),
    start,
    end,
    _csrf
  }, (data) => {
    if (data.result === 'updated') {
      $('#editDiplomaModal').modal('hide');
      notification({
        icon: 'check-circle',
        type: 'success',
        title: 'Diplôme mis à jour avec succès.',
        message: `La page va s'actualiser dans quelques secondes.`,
        onClosed: () => $(location).attr('href', `/formations`)
      });
    } else {
      if (data.errors) {
        errorsHandler(data.errors);
      }
    }
  }).catch((xhr, status, error) => catchError(xhr, status, error));
};

let lockService = (category) => {
  let inputServices = $('#service_id');
  ;
  if (category === "5")
    inputServices.val("56").trigger('change');
  if (category === "4")
    inputServices.val("55").trigger('change');
  if (category === "5" || category === "4"){
    inputServices.prop('disabled', true);
  }
  else {
    inputServices.prop('disabled', false);
    inputServices.val(null).trigger('change');
  }
};

$(document).ready(() => {
  let dtargv = {
    format: 'MM/YYYY',
    useCurrent: false
  };
  //XP Datepicker

  $('#xpStart').datetimepicker(dtargv).on('dp.change', (e) => {
    let incrementDay = moment(new Date(e.date));
    incrementDay.add(1, 'months');
    $('#xpEnd').data('DateTimePicker').minDate(incrementDay).viewMode('months');
  });
  $('#xpEnd').datetimepicker(dtargv).on('dp.change', (e) => {
    let decrementDay = moment(new Date(e.date));
    decrementDay.subtract(1, 'months');
    $('#xpStart').data('DateTimePicker').maxDate(decrementDay).viewMode('months');
  });
  // Formations datepicker
  $('#fStart').datetimepicker(dtargv).on('dp.change', (e) => {
    let incrementDay = moment(new Date(e.date));
    incrementDay.add(1, 'months');
    $('#fEnd').data('DateTimePicker').minDate(incrementDay).viewMode('months');
  });
  $('#fEnd').datetimepicker(dtargv).on('dp.change', (e) => {
    let decrementDay = moment(new Date(e.date));
    decrementDay.subtract(1, 'months');
    $('#fStart').data('DateTimePicker').maxDate(decrementDay).viewMode('months');
  });
  // Diplomas datepicker
  $('#dStart').datetimepicker(dtargv).on('dp.change', (e) => {
    let incrementDay = moment(new Date(e.date));
    incrementDay.add(1, 'months');
    $('#dEnd').data('DateTimePicker').minDate(incrementDay).viewMode('months');
  });
  $('#dEnd').datetimepicker(dtargv).on('dp.change', (e) => {
    let decrementDay = moment(new Date(e.date));
    decrementDay.subtract(1, 'months');
    $('#dStart').data('DateTimePicker').maxDate(decrementDay).viewMode('months');
  });

  let formationAutocomplete = [];
  let qualificationAutocomplete = [];

  $.get('/api/formations/all', function (data) {
    $.each(data.formations, function (i, formation) {
      formationAutocomplete.push(formation.name);
    });
  });
  $.get('/api/qualifications/all', function (data) {
    $.each(data.qualifications, function (i, qualification) {
      qualificationAutocomplete.push(qualification.name);
    });
  });
  formationAutocomplete.sort();
  qualificationAutocomplete.sort();
  $('#fName').autocomplete({
    source: formationAutocomplete
  });
  $('#dName').autocomplete({
    source: qualificationAutocomplete
  });

  $('#post_id').on('change', () => {
    let category = $('#post_id option:selected').attr('data-category');
    lockService(category);
  });
});

