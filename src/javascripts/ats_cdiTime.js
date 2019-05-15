function cdiTimeListener(){
  $('#backToContract').click(function() {
    loadTemplate('/static/views/ats/contract.hbs', {candidateDatas, databaseDatas, arrays}, (html) => {
      $('#atsPart').html(html);
    })
  });
  $('#toExperience').click(function() {
    if (verifyInputs()) {
      saveDatas();
      loadTemplate('/static/views/ats/experience.hbs', { candidateDatas, databaseDatas, arrays }, (html) => {
        $('#atsPart').html(html);
      })
    }
  });
};

function verifyInputs(){
  let fullpart = ($('.full-part input:checked').length > 0) ? true : notify('fullpart');
  let daynight = ($('.day-night input:checked').length > 0) ? true : notify('daynight');
  return (fullpart && daynight);
};

function notify(error){
  switch (error) {
    case 'fullpart':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci d'indiquer si vous souhaitez travailler à temps plein / partiel, ou les deux.`
      });
      break;
    case 'daynight':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci d'indiquer si vous souhaitez travailler de jour / nuit, ou les deux.`
      });
      break;
  }
};

function saveDatas(){
  candidateDatas.application.fullTime = $('#full_time').prop('checked');
  candidateDatas.application.partTime = $('#part_time').prop('checked');
  candidateDatas.application.dayTime = $('#day_time').prop('checked');
  candidateDatas.application.nightTime = $('#night_time').prop('checked');
};

function init_cdiTime(){
  cdiTimeListener();
};

init_cdiTime();