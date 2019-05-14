$('#backToPost').click(function() {
  loadTemplate('/static/views/ats/post.hbs', {candidateDatas, databaseDatas}, (html) => {
    $('#atsPart').html(html);
  })
});

$('#toTime').click(function() {
  let template = 'cdiTime';
  // let template = 'internshipTime';
  //TODO if toggle = travail durable : template = cdiTime.hbs
  //TODO else toggle = stage : template = internshipTime.hbs
  //TODO else toggle = missions ponctuelles : template = experience.hbs

  loadTemplate(`/static/views/ats/${template}.hbs`, {candidateDatas, databaseDatas}, (html) => {
    $('#atsPart').html(html);
  });
  //TODO if toggle = travail durable :

});