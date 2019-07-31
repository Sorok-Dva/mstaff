function resetAvailability(){
  candidateDatas.wish.fullTime = false;
  candidateDatas.wish.partTime = false;
  candidateDatas.wish.dayTime = false;
  candidateDatas.wish.nightTime = false;
};

function resetInternshipDate(){
  candidateDatas.wish.start = undefined;
  candidateDatas.wish.end = undefined;
};

function selectTemplate(checkedSwitch){
  switch (checkedSwitch) {
    case 'cdi-cdd':
      return 'cdiTime';
      break;
    case 'vacation':
      return 'experience';
      break;
    case 'internship':
      return 'internshipTime';
      break;
    default:
      return 'experience';
  }
};

function contractListener(){
  $('#backToPost').click(function () {
    loadTemplate('/views/ats/post.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });
  $('#toTime').click(function () {
    if (verifyInputs()){
      saveDatas();
      let selected = $('#contractChoices input:checked').attr('name');
      let template = selectTemplate(selected);
      if (selected === 'vacation' && permissions.recap){
        permissions.recap = false;
        loadTemplate(`/views/ats/recap.hbs`, {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
          $('#atsPart').html(html);
        });
      } else {
        loadTemplate(`/views/ats/${template}.hbs`, {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
          $('#atsPart').html(html);
        });
      }
    }
  });
  $('#contractChoices input').change(function () {
    if (this.checked){
      switch(this.id){
        case 'cdiToggle':
          $('#vacationToggle, #internshipToggle').prop('checked', false);
          resetInternshipDate();
          break;
        case 'vacationToggle':
          $('#cdiToggle, #internshipToggle').prop('checked', false);
          resetAvailability();
          resetInternshipDate();
          break;
        case 'internshipToggle':
          $('#cdiToggle, #vacationToggle').prop('checked', false);
          resetAvailability();
          break;
      }
    }
  });
};

function verifyInputs(){
  return ($('#contractChoices input:checked').length) ? true : notify('contractChoice');
};

function notify(error){
  switch (error) {
    case 'contractChoice':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci de sélectionner un type de contrat.`
      });
      break;
  }
  return false;
};

function saveDatas(){
  candidateDatas.wish.contractType = $('#contractChoices input:checked').prop('name');
};

function init_contract(){
  contractListener();
};

$(document).ready(() => {
  init_contract();
});

