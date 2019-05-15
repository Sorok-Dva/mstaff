function selectTemplate(savedValue){
  switch (savedValue) {
    case 'cdi':
      return 'cdiTime';
      break;
    case 'vacation':
      return 'contract';
      break;
    case 'internship':
      return 'internshipTime';
      break;
    default:
      return 'contract';
  }
};

function experienceListener(){
  $('.save').click(function() {
    $('#recap').addClass('d-lg-block');
  });

  $('.closeRecap').click(function() {
    $('#recap').removeClass('d-lg-block');
  });

  $('#backToContract').click(function() {
    let template = selectTemplate(candidateDatas.application.contractType);
    loadTemplate(`/static/views/ats/${template}.hbs`, {candidateDatas, databaseDatas, arrays}, (html) => {
      $('#atsPart').html(html);
    })
  });

  $('#toDiploma').click(function() {
    loadTemplate('/static/views/ats/diploma.hbs', {candidateDatas, databaseDatas, arrays}, (html) => {
      $('#atsPart').html(html);
    })
  });
};

function verifyInputs(){
};

function notify(error){
};

function saveDatas(){
};

function init_experience(){
  experienceListener();
};

init_experience();

//TODO a FAIRE