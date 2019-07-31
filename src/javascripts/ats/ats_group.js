function groupListener(){
  $('#toPost').click(function() {
    if (verifyInputs()){
      saveDatas();
      if (permissions.recap){
        permissions.recap = false;
        loadTemplate('/views/ats/recap.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
          $('#atsPart').html(html);
        })
      } else {
        loadTemplate('/views/ats/main.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
          $('#atsPart').html(html);
        })
      }
    }
  });

  $('#selectAllToggle').change( (e) => {
    if (e.currentTarget.checked){
      $('.finessToggle').prop('checked', true);
      $('#selectAllTitle').text('Désélectionner tout');
    } else {
      $('.finessToggle').prop('checked', false);
      $('#selectAllTitle').text('Sélectionner tout');
    }
  });
}

function notify(error){
  switch (error) {
    case 'noEstablishment':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci de sélectionner au minimum un établissement.`
      });
      break;
  }
  return false;
};

function saveDatas(){
  let checked = $('#finessList input:checked');
  let finessList = [];

  Object.keys(checked).forEach( key => {
    let id = checked[key].id;
    if (!isNaN(key)){
      if (!isNaN(id))
        finessList.push(id);
    }
  });
  candidateDatas.finess = finessList;
}

function verifyInputs(){
  return $('#finessList input:checked').length > 0 ? true : notify('noEstablishment');;
}

function reload_group(){
  candidateDatas.finess.forEach( finess => {
    $(`#${finess}`).prop('checked', true);
  });
}

$(document).ready(() => {
  groupListener();
  if(candidateDatas.finess.length > 0)
    reload_group();
});