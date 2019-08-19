function punctualContractListener(){
  $('#backToContract').click(function () {
    loadTemplate('/views/ats/contract.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });
  $('#toExperience').click(function () {
    if (verifyInputs()){
      saveDatas();
      loadTemplate('/views/ats/experience.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
        $('#atsPart').html(html);
      })
    }
  });
  $('#punctualTypeChoices input').change(function () {
    if (this.checked){
      switch(this.id){
        case 'cddToggle':
          $('#rlToggle').prop('checked', false);
          break;
        case 'rlToggle':
          $('#cddToggle').prop('checked', false);
          break;
      }
    }
  });
}

function verifyInputs(){
  return ($('#punctualTypeChoices input:checked').length) ? true : notify('contractChoice');
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
  candidateDatas.wish.contractType = $('#punctualTypeChoices input:checked').prop('name');
}

$(document).ready(() => {
  punctualContractListener();
});