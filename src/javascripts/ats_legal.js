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
      // console.log(candidateDatas.experiences, candidateDatas.diplomas, candidateDatas.qualifications, candidateDatas.skills, candidateDatas.wish);
      // candidateDatas.experiences = [];
      // candidateDatas.diplomas = [];
      // candidateDatas.qualifications = [];
      // candidateDatas.skills = [];
      // candidateDatas.wish = [];
      // console.log(candidateDatas.experiences.length, candidateDatas.diplomas.length, candidateDatas.qualifications.length, candidateDatas.skills.length, candidateDatas.wish.length);
      // // --------------------------------------------

      console.log(candidateDatas.experiences, candidateDatas.diplomas, candidateDatas.qualifications, candidateDatas.skills, candidateDatas.wish);
      //TODO add application

      $.post('/ats/add/all', {
        experiences: candidateDatas.experiences.length > 0 ? candidateDatas.experiences : 'none',
        diplomas: candidateDatas.diplomas.length > 0 ? candidateDatas.diplomas : 'none',
        qualifications: candidateDatas.qualifications.length > 0 ? candidateDatas.qualifications : 'none',
        skills: candidateDatas.skills.length > 0 ? candidateDatas.skills : 'none',
        application: candidateDatas.wish.length > 0 ? candidateDatas.wish : 'none',
        _csrf
      }, (data) => {
        console.log(data);
      });
    }
  }).catch(error => errorsHandler(error));
};

legalListener();