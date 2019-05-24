function qualificationListener(){
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

  $('#backToDiploma').click(function() {
    loadTemplate('/static/views/ats/diploma.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });

  $('#toSkill').click(function() {
    loadTemplate('/static/views/ats/skill.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });
};

function resetForm(){
  $('#qualificationForm').trigger('reset');
}

function editQualification(id){
  permissions.editMode = true;
  permissions.editId = id;
  let i = candidateDatas.qualifications.map(qualification => qualification.id).indexOf(id);
  resetForm();
  $('#qualification').val(candidateDatas.qualifications[i].qualification).trigger('keyup');
  $('#qualificationStart').data("DateTimePicker").date(candidateDatas.qualifications[i].start);
  if (candidateDatas.qualifications[i].end)
    $('#qualificationEnd').data("DateTimePicker").date(candidateDatas.qualifications[i].end);
  $('#qualificationDate').trigger('change');
};

function deleteQualification(id){
  resetForm();
  permissions.editMode = false;
  let i = candidateDatas.qualifications.map(qualification => qualification.id).indexOf(id);
  candidateDatas.qualifications.splice(i, 1);
  $(`div [data-id=${id}]`).remove();
};

function addToDatasRecap(item){
  let title = `<h3>#Diplôme n° ${item.id}</h3>`;
  let customClass = `class="row justify-content-between align-items-center mt-3 recap-item"`;
  let editButton = `<button class="btn padding-0 mr-3" onclick="editQualification(${item.id})"><i class="fal fa-edit"></i></button>`;
  let deleteButton = `<button class="btn padding-0" onclick="deleteQualification(${item.id})"><i class="fal fa-trash-alt"></i></button>`;
  $(`<div ${customClass} data-id="${item.id}">${title}<div>${editButton}${deleteButton}</div></div>`).appendTo($('.recap'));
};

function generateDatasRecap(){
  $('.recap-item').remove();
  candidateDatas.qualifications.forEach( qualification => addToDatasRecap(qualification));
};

function createQualificationList(qualifications, input){
  arrays.qualifications = [];
  qualifications.forEach( qualification => {
    arrays.qualifications.push(qualification.name);
  });
  arrays.qualifications.sort();
  input.autocomplete({
    source: arrays.qualifications,
    minLength: 1
  });
};

function verifyInputs(){
  let now = moment().startOf('day');
  let qualification = !$.isEmptyObject($('#qualification').val()) && $('#qualification').val().length > 2  ? true : notify('noQualification');
  let qualificationStart = $('#qualificationStart').data("DateTimePicker").date();
  let qualificationEnd = $('#qualificationEnd').data("DateTimePicker").date();
  if (qualificationStart !== null){
    let validQualificationStart = qualificationStart.startOf('day').isSameOrBefore(now) ? true : notify('startDateAfterNow');
    let validQualificationEnd = true;
    if (qualificationEnd !== null)
      validQualificationEnd = qualificationEnd.startOf('day').isSameOrAfter(qualificationStart.startOf('day')) ? true : notify('endDateBeforeStart');
    return (qualification && validQualificationStart && validQualificationEnd);
  }
  return notify('noStartDate');
};

function notify(error){
  switch (error) {
    case 'noQualification':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci d'indiquer un diplôme (3 caractères minimum).`
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
    let qualifications = candidateDatas.qualifications;
    current =  qualifications[qualifications.map(qualification => qualification.id).indexOf(permissions.editId)];
  } else {
    current.id = permissions.qualificationId;
    permissions.qualificationId += 1;
  }
  current.name = $('#qualification').val();
  current.start = new Date($('#qualificationStart').data("DateTimePicker").date());
  current.end = null;
  if ($('#qualificationEnd').data("DateTimePicker").date())
    current.end = new Date($('#qualificationEnd').data("DateTimePicker").date());
  if (editMode){
    permissions.editMode = false;
  } else {
    candidateDatas.qualifications.push(current);
  }
};

function init_qualification(){
  qualificationListener();
  createQualificationList(databaseDatas.allQualifications, $('#qualification'));
  $('#qualificationStart, #qualificationEnd').datetimepicker({
    format: 'D MMMM YYYY',
    useCurrent: false,
    ignoreReadonly: true,
    maxDate: moment().startOf('day')
  });

};


$(document).ready(() => {
  init_qualification();
  if(candidateDatas.qualifications.length > 0)
    generateDatasRecap();
});
