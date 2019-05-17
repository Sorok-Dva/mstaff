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
  candidateDatas.identity._csrf = $('meta[name="csrf-token"]').attr('content');
  console.log(es_finess);
  // $.post('/register/', candidateDatas.identity, (data) => {
  //   if (data.result === 'created'){
  //     if (candidateDatas.experiences.length > 0){
  //       //TODO A FINIR
  //       $.post('/add/experience', { experiences, _csrf: $('#csrfToken').val() }, (data) => {
  //         console.log(data);
  //       });
  //     }
  //     console.log(es_finess);
  //     console.table(candidateDatas.application);
  //     console.table(candidateDatas.experiences);
  //     console.table(candidateDatas.diplomas);
  //     console.table(candidateDatas.qualifications);
  //     console.table(candidateDatas.skills);
  //   }
  // }).catch(error => errorsHandler(error));
  //TODO

};

legalListener();