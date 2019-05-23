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

  console.log(candidateDatas.experiences, candidateDatas.diplomas, candidateDatas.qualifications, candidateDatas.skills, candidateDatas.wish);

};

function finalize(es_finess){
  let _csrf = $('meta[name="csrf-token"]').attr('content');

  candidateDatas.identity._csrf = _csrf;
  $.post('/register/', candidateDatas.identity, (data) => {
    if (data.result === 'created'){
      $.post('/ats/add/all', {
        experiences: candidateDatas.experiences.length > 0 ? candidateDatas.experiences : 'none',
        diplomas: candidateDatas.diplomas.length > 0 ? candidateDatas.diplomas : 'none',
        qualifications: candidateDatas.qualifications.length > 0 ? candidateDatas.qualifications : 'none',
        skills: candidateDatas.skills.length > 0 ? candidateDatas.skills : 'none',
        wish: !$.isEmptyObject(candidateDatas.wish) ? candidateDatas.wish : 'none',
        finess : candidateDatas.finess,
        _csrf
      }, (data) => {
        if (data.result === 'created'){
          console.log(data.entities);
        }
      })
    }
  }).catch(error => errorsHandler(error));
};

legalListener();