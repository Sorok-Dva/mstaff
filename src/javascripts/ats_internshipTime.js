function resetInternshipDate(){
  candidateDatas.wish.start = null;
  candidateDatas.wish.end = null;
};

function internshipTimeListener(){
  $('#backToContract').click(function() {
    resetInternshipDate();
    loadTemplate('/static/views/ats/contract.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });

  $('#toExperience').click(function() {
    if (verifyInputs()){
      saveDatas();
      loadTemplate('/static/views/ats/experience.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
        $('#atsPart').html(html);
      });
    }
  });
};

function verifyInputs(){
  let now = moment().startOf('day');
  let start = $('#start').data("DateTimePicker").date();
  let end = $('#end').data("DateTimePicker").date();

  if (start !== null && end !== null){
    let validStart = start.startOf('day').isSameOrAfter(now) ? true : notify('internshipWrongStart');
    let validEnd = end.startOf('day').isAfter(start.startOf('day')) ? true : notify('internshipWrongEnd');
    return (validStart && validEnd);
  }
  return notify('noDateInternship');
};

function notify(error){
  switch (error) {
    case 'internshipWrongStart':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci de choisir une date postérieure ou égale à la date du jour.`
      });
      break;
    case 'internshipWrongEnd':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci de choisir une date de fin postérieure à celle de départ.`
      });
      break;
    case 'noDateInternship':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci d'indiquer une date de début ainsi qu'une date de fin.`
      });
      break;
  }
  return false;
};

function saveDatas(){
  candidateDatas.wish.start = new Date($('#start').data("DateTimePicker").date());
  candidateDatas.wish.end = new Date($('#end').data("DateTimePicker").date());
};

function init_internshipTime(){
  internshipTimeListener();
  $('#internshipDate input').datetimepicker({
    format: 'D MMMM YYYY',
    useCurrent: false,
    ignoreReadonly: true,
    minDate: moment().startOf('day')
  });

};

function reload_internshipTime(){
  $('#start').data("DateTimePicker").date(candidateDatas.wish.start);
  $('#end').data("DateTimePicker").date(candidateDatas.wish.end);
};

init_internshipTime();
if(candidateDatas.wish.start && candidateDatas.wish.end)
  reload_internshipTime();