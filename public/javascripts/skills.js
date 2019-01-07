let listSkills = [];
let listEquipments = [];
let listSoftwares = [];

$.get('/api/skills/all', (data) => $.map(data.skills, skill => listSkills.push(skill.name)));
$.get('/api/equipments/all', (data) => $.map(data.equipments, equipment => listEquipments.push(equipment.name)));
$.get('/api/softwares/all', (data) => $.map(data.softwares, software => listSoftwares.push(software.name)));

$('#skills').autocomplete({
  source: listSkills,
  minLength: 3,
  select: (event, ui) => {
    if ($(`td:contains('${ui.item.label}')`).length > 0) {
      $('#addNewSkill').attr('disabled', 'disabled');
      $('#skillAlreadyInList').show();
    } else {
      $('#addNewSkill').removeAttr('disabled');
      $('#skillAlreadyInList').hide();
    }
  },
  search: (event, ui) => {
    if ($(`td:contains('${event.target.value}')`).length > 0) {
      $('#addNewSkill').attr('disabled', 'disabled');
      $('#skillAlreadyInList').show();
    } else {
      $('#addNewSkill').removeAttr('disabled');
      $('#skillAlreadyInList').hide();
    }
  }
});
$('#equipments').autocomplete({
  source: listEquipments,
  minLength: 3,
  select: (event, ui) => {
    if ($(`td:contains('${ui.item.label}')`).length > 0) {
      $('#addNewEquipment').attr('disabled', 'disabled');
      $('#equipmentAlreadyInList').show();
    } else {
      $('#addNewEquipment').removeAttr('disabled');
      $('#equipmentAlreadyInList').hide()
    }
  },
  search: (event, ui) => {
    if ($(`td:contains('${event.target.value}')`).length > 0) {
      $('#addNewEquipment').attr('disabled', 'disabled');
      $('#equipmentAlreadyInList').show();
    } else {
      $('#addNewEquipment').removeAttr('disabled');
      $('#equipmentAlreadyInList').hide();
    }
  }
});
$('#softwares').autocomplete({
  source: listSoftwares,
  minLength: 3,
  select: (event, ui) => {
    if ($(`td:contains('${ui.item.label}')`).length > 0) {
      $('#addNewSoftware').attr('disabled', 'disabled');
      $('#softwareAlreadyInList').show();
    } else {
      $('#addNewSoftware').removeAttr('disabled');
      $('#softwareAlreadyInList').hide()
    }
  },
  search: (event, ui) => {
    if ($(`td:contains('${event.target.value}')`).length > 0) {
      $('#addNewSoftware').attr('disabled', 'disabled');
      $('#softwareAlreadyInList').show();
    } else {
      $('#addNewSoftware').removeAttr('disabled');
      $('#softwareAlreadyInList').hide();
    }
  }
});

$('#addNewSkill').click(() => {
  let _csrf = $('#csrfToken').val();
  let name = $('#skills').val();
  $.post('/api/candidate/skills/add', {name, _csrf}, (data) => {
    if (data.skill) {
      notification({
        icon: 'check-circle',
        type: 'success',
        title: 'Compétence ajoutée avec succès :',
        message: `Votre compétence "${data.skill.name}" vient d'être ajoutée à votre liste.`
      });
      $("#skillsList").append($('<tr>')
        .attr({'data-type': 'skill', 'data-id': data.skill.id})
        .append($('<td>').text(`${data.skill.name}`))
        .append($('<td>').append($('<div>').attr({class: 'rating-stars text-center'})
          .append($('<ul>').attr({
            class: 'stars',
            'data-type': 'skill',
            'data-id': data.skill.id
          })
            .append($('<li>').attr({class: 'star', title: 'Poor', 'data-value': 1}).html('<i class="fa fa-star"></i>'))
            .append($('<li>').attr({class: 'star', title: 'Fair', 'data-value': 2}).html('<i class="fa fa-star"></i>'))
            .append($('<li>').attr({class: 'star', title: 'Good', 'data-value': 3}).html('<i class="fa fa-star"></i>'))
            .append($('<li>').attr({class: 'star', title: 'Excellent', 'data-value': 4}).html('<i class="fa fa-star"></i>')))
        ))
        .append($('<td>').append($('<button>').attr({
          class: 'btn btn-simple btn-danger btn-icon remove',
          'data-type': 'skill',
          'data-id': data.skill.id
        }).html('<i class="fa fa-trash"></i>')))
      );
    }
  }).catch(error => {
    error = error.responseJSON;
    if (error.error === 'Already exists') {
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Ajout impossible',
        message: `Cette compétence est déjà ajoutée à votre profil.`
      });
    } else return errorsHandler(error);
  });
});
$('#addNewEquipment').click(() => {
  let _csrf = $('#csrfToken').val();
  let name = $('#equipments').val();
  $.post('/api/candidate/equipments/add', {name, _csrf}, (data) => {
    if (data.equipment) {
      notification({
        icon: 'check-circle',
        type: 'success',
        title: 'Matériel / produit ajouté avec succès :',
        message: `Votre matériel ou produit "${data.equipment.name}" vient d'être ajouté à vos compétences.`
      });
      $("#equipmentsList").append($('<tr>')
        .attr({'data-type': 'equipment', 'data-id': data.equipment.id})
        .append($('<td>').text(`${data.equipment.name}`))
        .append($('<td>').append($('<div>').attr({class: 'rating-stars text-center'})
          .append($('<ul>').attr({
            class: 'stars',
            'data-type': 'equipment',
            'data-id': data.equipment.id
          })
            .append($('<li>').attr({class: 'star', title: 'Poor', 'data-value': 1}).html('<i class="fa fa-star"></i>'))
            .append($('<li>').attr({class: 'star', title: 'Fair', 'data-value': 2}).html('<i class="fa fa-star"></i>'))
            .append($('<li>').attr({class: 'star', title: 'Good', 'data-value': 3}).html('<i class="fa fa-star"></i>'))
            .append($('<li>').attr({class: 'star', title: 'Excellent', 'data-value': 4}).html('<i class="fa fa-star"></i>')))
        ))
        .append($('<td>').append($('<button>').attr({
          class: 'btn btn-simple btn-danger btn-icon remove',
          'data-type': 'equipment',
          'data-id': data.equipment.id
        }).html('<i class="fa fa-trash"></i>')))
      );
    }
  }).catch(error => {
    error = error.responseJSON;
    if (error.error === 'Already exists') {
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Ajout impossible',
        message: `Ce matériel ou produit est déjà ajouté à votre profil.`
      });
    } else return errorsHandler(error);
  });
});
$('#addNewSoftware').click(() => {
  let _csrf = $('#csrfToken').val();
  let name = $('#softwares').val();
  $.post('/api/candidate/softwares/add', {name, _csrf}, (data) => {
    if (data.software) {
      notification({
        icon: 'check-circle',
        type: 'success',
        title: 'Logiciel ajouté avec succès :',
        message: `Le logiciel "${data.software.name}" vient d'être ajouté à vos compétences.`
      });
      $("#softwaresList").append($('<tr>')
        .attr({'data-type': 'software', 'data-id': data.software.id})
        .append($('<td>').text(`${data.software.name}`))
        .append($('<td>').append($('<div>').attr({class: 'rating-stars text-center'})
          .append($('<ul>').attr({
            class: 'stars',
            'data-type': 'software',
            'data-id': data.software.id
          })
            .append($('<li>').attr({class: 'star', title: 'Poor', 'data-value': 1}).html('<i class="fa fa-star"></i>'))
            .append($('<li>').attr({class: 'star', title: 'Fair', 'data-value': 2}).html('<i class="fa fa-star"></i>'))
            .append($('<li>').attr({class: 'star', title: 'Good', 'data-value': 3}).html('<i class="fa fa-star"></i>'))
            .append($('<li>').attr({class: 'star', title: 'Excellent', 'data-value': 4}).html('<i class="fa fa-star"></i>')))
        ))
        .append($('<td>').append($('<button>').attr({
          class: 'btn btn-simple btn-danger btn-icon remove',
          'data-type': 'software',
          'data-id': data.software.id
        }).html('<i class="fa fa-trash"></i>')))
      );
    }
  }).catch(error => {
    error = error.responseJSON;
    if (error.error === 'Already exists') {
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Ajout impossible',
        message: `Ce logiciel est déjà ajouté à votre profil.`
      });
    } else return errorsHandler(error);
  });
});

$('body').on('click', '.remove', function () {
  let type = $(this).attr('data-type');
  let id = $(this).attr('data-id');

  $.delete(`/api/candidate/${type}/${id}`, {_csrf}, (data) => {
    if (data.deleted) {
      notification({
        icon: 'check-circle',
        type: 'success',
        title: 'Compétence supprimée avec succès.',
        message: ``
      });
      $(`tr[data-type="${type}"][data-id="${id}"]`).remove();
    }
  }).catch(error => {
    error = error.responseJSON;
    if (error !== undefined && error.error === 'Not exists') {
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Suppression impossible',
        message: `Cette compétence n'est pas liée à votre profil.`
      });
    } else return errorsHandler(error);
  });
});
