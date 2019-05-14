function selectTemplate(checkedSwitch){
  switch (checkedSwitch) {
    case 'cdi':
      return 'cdiTime';
      break;
    case 'vacation':
      return 'experience';
      break;
    case 'internship':
      return 'internshipTime';
      break;
    default:
      return null;
  }
};
function contractListener(){
  $('#backToPost').click(function () {
    loadTemplate('/static/views/ats/post.hbs', {candidateDatas, databaseDatas, arrays}, (html) => {
      $('#atsPart').html(html);
    })
  });
  $('#toTime').click(function () {
    if (verifyInputs()){
      saveDatas();
      let selected = $('#contractChoices input:checked').attr('name');
      let template = selectTemplate(selected);
      loadTemplate(`/static/views/ats/${template}.hbs`, {candidateDatas, databaseDatas, arrays}, (html) => {
        $('#atsPart').html(html);
      });
    }
  });

  $('#contractChoices input').change(function () {
    if (this.checked){
      switch(this.id){
        case 'cdiToggle':
          $('#vacationToggle, #internshipToggle').prop('checked', false);
          break;
        case 'vacationToggle':
          $('#cdiToggle, #internshipToggle').prop('checked', false);
          break;
        case 'internshipToggle':
          $('#cdiToggle, #vacationToggle').prop('checked', false);
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
  candidateDatas.application.contractType = $('#contractChoices input:checked').prop('name');
};

function init_contract(){
  contractListener();
};

function reload_contract(){
  //todo recheck
};

init_contract();
if(candidateDatas.application.contractType)
  reload_contract();