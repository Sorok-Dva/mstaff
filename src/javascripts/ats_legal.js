function legalListener(){
  $('#backToRecap').click(function() {
    loadTemplate('/static/views/ats/recap.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });

  $('#final-text input').change( () => {
    let first = $('#legal-first').prop('checked');
    let second = $('#legal-second').prop('checked');
    let button = $('.final-button');
    (first && second) ? button.css('visibility', '') : button.css('visibility', 'hidden');
  });
};

function finalize(es_finess){
  let _csrf = $('meta[name="csrf-token"]').attr('content');

  candidateDatas.identity._csrf = _csrf;
  $.post('/register/', candidateDatas.identity, (data) => {
    if (data.result === 'created'){
      console.log('user created');
      console.log(data);

      // // FOR TEST VALUES ----------------------------
      // console.log(candidateDatas.experiences, candidateDatas.diplomas, candidateDatas.qualifications, candidateDatas.skills, candidateDatas.application);
      // candidateDatas.experiences = [];
      // candidateDatas.diplomas = [];
      // candidateDatas.qualifications = [];
      // candidateDatas.skills = [];
      // candidateDatas.application = [];
      // console.log(candidateDatas.experiences.length, candidateDatas.diplomas.length, candidateDatas.qualifications.length, candidateDatas.skills.length, candidateDatas.application.length);
      // // --------------------------------------------



      $.post('/ats/add/all', {
        experiences: candidateDatas.experiences.length > 0 ? candidateDatas.experiences : 'none',
        diplomas: candidateDatas.diplomas,
        qualifications: candidateDatas.qualifications,
        skills: candidateDatas.skills,
        _csrf
      }, (data) => {
        console.log(data);
      });
    }
  }).catch(error => errorsHandler(error));
  //TODO

};

legalListener();