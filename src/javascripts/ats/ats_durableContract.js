function resetAvailability(){
  candidateDatas.wish.fullTime = false;
  candidateDatas.wish.partTime = false;
  candidateDatas.wish.dayTime = false;
  candidateDatas.wish.nightTime = false;
}

function durableContractListener(){
  $('#backToContract').click(function () {
    loadTemplate('/views/ats/contract.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });
  $('#toExperience').click(function () {
    if (verifyInputs()){
      saveDatas();
      let selected = $('#durableTypeChoices input:checked').attr('name');
      if (selected === 'CDI'){
        loadTemplate('/views/ats/cdiTime.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
          $('#atsPart').html(html);
        })
      } else {
        loadTemplate('/views/ats/experience.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
          $('#atsPart').html(html);
        })
      }
    }
  });
  $('#durableTypeChoices input').change(function () {
    if (this.checked){
      switch(this.id){
        case 'cdiToggle':
          $('#cpToggle, #clToggle, #alToggle, #rclToggle').prop('checked', false);
          break;
        case 'cpToggle':
          $('#cdiToggle, #clToggle, #alToggle, #rclToggle').prop('checked', false);
          resetAvailability();
          break;
        case 'clToggle':
          $('#cdiToggle, #cpToggle, #alToggle, #rclToggle').prop('checked', false);
          resetAvailability();
          break;
        case 'alToggle':
          $('#cdiToggle, #cpToggle, #clToggle, #rclToggle').prop('checked', false);
          resetAvailability();
          break;
        case 'rclToggle':
          $('#cdiToggle, #cpToggle, #clToggle, #alToggle').prop('checked', false);
          resetAvailability();
          break;
      }
    }
  });
}

function verifyInputs(){
  return ($('#durableTypeChoices input:checked').length) ? true : notify('contractChoice');
}

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
}

function saveDatas(){
  candidateDatas.wish.contractType = $('#durableTypeChoices input:checked').prop('name');
}

$(document).ready(() => {
  durableContractListener();
});