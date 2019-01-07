$('#addExperience').click(() => {
  let startDate = $('#xpStart').val().split('/');
  let endDate = $('#xpEnd').val().split('/');
  let stop = false;
  let name = $('#xpName').val();
  let service_id = parseInt($('#service_id').val());
  let post_id = parseInt($('#post_id').val());
  let internship = $('#xpInternship').prop('checked');
  let current = $('#xpCurrent').prop('checked');
  let start = new Date(startDate[1], startDate[0] - 1);
  let end = new Date(endDate[1], endDate[0] - 1);
  let _csrf = $('#csrfToken').val();

  if (name === "" || null) {
    notification({
      icon: 'exclamation',
      type: 'danger',
      title: 'Champ invalide :',
      message: `Vous devez indiquer une nom pour votre expérience.`
    });
    stop = true
  }
  if (isNaN(start.getTime())) {
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
  if (!current && isNaN(end.getTime())) {
    notification({
      icon: 'exclamation',
      type: 'danger',
      title: 'Champ invalide :',
      message: `Vous devez indiquer une date de fin valide.`
    });
    stop = true
  }
  if (!stop) {
    if (isNaN(end.getTime())) end = null;
    $.post('/add/Experience', { name, service_id, post_id, internship, current, start, end, _csrf}, (data) => {
      if (data.experience) {
        console.log(data.experience);
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
        $("#experienceTbody").append($('<tr>')
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
    }).catch(errors => errorsHandler(errors));
  }
});
$('#addFormation').click(() => {
  let startDate = $('#fStart').val().split('/');
  let endDate = $('#fEnd').val().split('/');
  let stop = false;
  let name = $('#fName').val();
  let start = new Date(startDate[1], startDate[0] - 1);
  let end = new Date(endDate[1], endDate[0] - 1);
  let _csrf = $('#csrfToken').val();

  if (isNaN(start.getTime())) {
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
  if (isNaN(end.getTime())) {
    notification({
      icon: 'exclamation',
      type: 'danger',
      title: 'Champ invalide :',
      message: `Vous devez indiquer une date de fin valide.`
    });
    stop = true
  }
  if (!stop) {
    if (isNaN(end.getTime())) end = null;
    $.post('/add/Formation', { name, start, end, _csrf}, (data) => {
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
        $("#formationsTbody").append($('<tr>')
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
    }).catch(errors => errorsHandler(errors))
  }
});
$('#addDiploma').click(() => {
  let startDate = $('#dStart').val().split('/');
  let endDate = $('#dEnd').val().split('/');
  let stop = false;
  let name = $('#dName').val();
  let start = new Date(startDate[1], startDate[0] - 1);
  let end = new Date(endDate[1], endDate[0] - 1);
  let _csrf = $('#csrfToken').val();

  if (isNaN(start.getTime())) {
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
  if (isNaN(end.getTime())) {
    notification({
      icon: 'exclamation',
      type: 'danger',
      title: 'Champ invalide :',
      message: `Vous devez indiquer une date de fin valide.`
    });
    stop = true
  }
  if (!stop) {
    if (isNaN(end.getTime())) end = null;
    $.post('/add/Diploma', { name, start, end, _csrf}, (data) => {
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
        $("#diplomaTbody").append($('<tr>')
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
    }).catch(errors => errorsHandler(errors))
  }
});

$('#service_id').select2();
$('#post_id').select2();

$('body').on('click', 'button.removeXP', (event) => {
  let id = $(event.target).attr('data-id') || $(event.target).parent().attr('data-id');
  $('#btnRemoveXp').attr('onclick', `removeCandidateExperience(${id})`);
  $("#removeExperienceModal").modal();
}).on('click', 'button.removeFormation', (event) => {
  let id = $(event.target).attr('data-id') || $(event.target).parent().attr('data-id');
  $('#btnRemoveFormation').attr('onclick', `removeCandidateFormation(${id})`);
  $("#removeFormationModal").modal();
}).on('click', 'button.removeDiploma', (event) => {
  let id = $(event.target).attr('data-id') || $(event.target).parent().attr('data-id');
  $('#btnRemoveDiploma').attr('onclick', `removeCandidateDiploma(${id})`);
  $("#removeDiplomaModal").modal();
}).on('click', 'button.editXP', (event) => {
  let id = $(event.target).attr('data-id') || $(event.target).parent().attr('data-id');
  $.get(`/api/candidate/xp/${id}`, (data) => {
    if (data.experience) {
      let start = new Date(data.experience.start);
      let end = data.experience.end === null ? null : new Date(data.experience.end);

      $('#editName').val(data.experience.name);
      $('#editPost_id').val(data.experience.poste_id);
      $('#editService_id').val(data.experience.service_id);
      $('#editStart').val(`${("0" + (start.getMonth() + 1)).slice(-2)}/${start.getFullYear()}`);
      $('#editInternship').prop('checked', !!data.experience.internship);
      $('#editCurrent').prop('checked', !!data.experience.current);

      if (end === null) {
        $('#editEnd').prop('disabled', true);
      } else {
        $('#editEnd').prop('disabled', false);
        $('#editEnd').val(`${("0" + (end.getMonth() + 1)).slice(-2)}/${end.getFullYear()}`);
      }
      $("#editXpModal").modal();
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
      let start = new Date(data.formation.start);
      let end = data.formation.end === null ? null : new Date(data.formation.end);

      $('#editFName').val(data.formation.name);
      $('#editFStart').val(`${("0" + (start.getMonth() + 1)).slice(-2)}/${start.getFullYear()}`);

      if (end === null) {
        $('#editFEnd').prop('disabled', true);
      } else {
        $('#editFEnd').prop('disabled', false);
        $('#editFEnd').val(`${("0" + (end.getMonth() + 1)).slice(-2)}/${end.getFullYear()}`);
      }
      $("#editFormationModal").modal();
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
      let start = new Date(data.diploma.start);
      let end = data.diploma.end === null ? null : new Date(data.diploma.end);

      $('#editDName').val(data.diploma.name);
      $('#editDStart').val(`${("0" + (start.getMonth() + 1)).slice(-2)}/${start.getFullYear()}`);

      if (end === null) {
        $('#editDEnd').prop('disabled', true);
      } else {
        $('#editDEnd').prop('disabled', false);
        $('#editDEnd').val(`${("0" + (end.getMonth() + 1)).slice(-2)}/${end.getFullYear()}`);
      }
      $("#editDiplomaModal").modal();
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
  $.delete(`/api/candidate/xp/${id}`, { _csrf } ,(data) => {
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
  $.delete(`/api/candidate/formation/${id}`, { _csrf } ,(data) => {
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
  $.delete(`/api/candidate/diploma/${id}`, { _csrf } ,(data) => {
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