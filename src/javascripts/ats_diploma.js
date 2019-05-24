function diplomaListener(){
  $('.save').click(function() {
    if (verifyInputs()){
      saveDatas(permissions.editMode);
      generateDatasRecap();
      resetForm();
    }
  });

  $('.openRecap').click(function() {
    $('#recap').addClass('d-lg-block');
  });

  $('.closeRecap').click(function() {
    $('#recap').removeClass('d-lg-block');
  });

  $('#backToExperience').click(function() {
    loadTemplate('/static/views/ats/experience.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });

  $('#toQualification').click(function() {
    loadTemplate('/static/views/ats/qualification.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });
};

function resetForm(){
  $('#diplomaForm').trigger('reset');
}

function editDiploma(id){
  permissions.editMode = true;
  permissions.editId = id;
  let i = candidateDatas.diplomas.map(diploma => diploma.id).indexOf(id);
  resetForm();
  $('#diploma').val(candidateDatas.diplomas[i].diploma).trigger('keyup');
  $('#diplomaStart').data("DateTimePicker").date(candidateDatas.diplomas[i].start);
  if (candidateDatas.diplomas[i].end)
    $('#diplomaEnd').data("DateTimePicker").date(candidateDatas.diplomas[i].end);
  $('#diplomaDate').trigger('change');
};

function deleteDiploma(id){
  resetForm();
  permissions.editMode = false;
  let i = candidateDatas.diplomas.map(diploma => diploma.id).indexOf(id);
  candidateDatas.diplomas.splice(i, 1);
  $(`div [data-id=${id}]`).remove();
};

function addToDatasRecap(item){
  let title = `<h3>#Formation n° ${item.id}</h3>`;
  let customClass = `class="row justify-content-between align-items-center mt-3 recap-item"`;
  let editButton = `<button class="btn padding-0 mr-3" onclick="editDiploma(${item.id})"><i class="fal fa-edit"></i></button>`;
  let deleteButton = `<button class="btn padding-0" onclick="deleteDiploma(${item.id})"><i class="fal fa-trash-alt"></i></button>`;
  $(`<div ${customClass} data-id="${item.id}">${title}<div>${editButton}${deleteButton}</div></div>`).appendTo($('.recap'));
};

function generateDatasRecap(){
  $('.recap-item').remove();
  candidateDatas.diplomas.forEach( diploma => addToDatasRecap(diploma));
};

function createDiplomaList(diplomas, input){
  arrays.diplomas = [];
  diplomas.forEach( diploma => {
    arrays.diplomas.push(diploma.name);
  });
  arrays.diplomas.sort();
  input.autocomplete({
    source: arrays.diplomas,
    minLength: 1
  });
};

function verifyInputs(){
  let now = moment().startOf('day');
  let diploma = !$.isEmptyObject($('#diploma').val()) && $('#diploma').val().length > 2 ? true : notify('noDiploma');
  let diplomaStart = $('#diplomaStart').data("DateTimePicker").date();
  let diplomaEnd = $('#diplomaEnd').data("DateTimePicker").date();
  if (diplomaStart !== null){
    let validDiplomaStart = diplomaStart.startOf('day').isSameOrBefore(now) ? true : notify('startDateAfterNow');
    let validDiplomaEnd = true;
    if (diplomaEnd !== null)
      validDiplomaEnd = diplomaEnd.startOf('day').isSameOrAfter(diplomaStart.startOf('day')) ? true : notify('endDateBeforeStart');
    return (diploma && validDiplomaStart && validDiplomaEnd);
  }
  return notify('noStartDate');
};

function notify(error){
  switch (error) {
    case 'noDiploma':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci d'indiquer une formation (3 caractères minimum).`
      });
      break;
    case 'startDateAfterNow':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci de choisir une date antérieure ou égale à la date du jour.`
      });
      break;
    case 'endDateBeforeStart':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci de choisir une date de fin postérieure ou égale à celle de départ.`
      });
      break;
    case 'noStartDate':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci d'indiquer une date de début.`
      });
      break;
  }
  return false;
};

function saveDatas(editMode){
  let current = {};
  if (editMode){
    let diplomas = candidateDatas.diplomas;
    current =  diplomas[diplomas.map(diploma => diploma.id).indexOf(permissions.editId)];
  } else {
    current.id = permissions.diplomaId;
    permissions.diplomaId += 1;
  }
  current.name = $('#diploma').val();
  current.start = new Date($('#diplomaStart').data("DateTimePicker").date());
  current.end = null;
  if ($('#diplomaEnd').data("DateTimePicker").date())
    current.end = new Date($('#diplomaEnd').data("DateTimePicker").date());
  if (editMode){
    permissions.editMode = false;
  } else {
    candidateDatas.diplomas.push(current);
  }
};

function init_diploma(){
  diplomaListener();
  createDiplomaList(databaseDatas.allDiplomas, $('#diploma'));
  $('#diplomaStart, #diplomaEnd').datetimepicker({
    format: 'D MMMM YYYY',
    useCurrent: false,
    ignoreReadonly: true,
    maxDate: moment().startOf('day'),
  });
};


$(document).ready(() => {
  init_diploma();
  if(candidateDatas.diplomas.length > 0)
    generateDatasRecap();
});

