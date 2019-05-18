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
      console.log('experience');
      console.log(candidateDatas.experiences);
      if (candidateDatas.experiences.length > 0){
        $.post('/add/experience', { experiences : candidateDatas.experiences, _csrf }, (data) => {
          console.log(data);
        });
      }
      // console.log(es_finess);
      // console.table(candidateDatas.application);
      // console.table(candidateDatas.experiences);
      // console.table(candidateDatas.diplomas);
      // console.table(candidateDatas.qualifications);
      // console.table(candidateDatas.skills);
    }
  }).catch(error => errorsHandler(error));
  //TODO

};

legalListener();