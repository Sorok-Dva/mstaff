function recapListener(){
  $('#backToIdentity').click(function() {
    loadTemplate('/static/views/ats/identity.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });

  $('#toLegal').click(function() {
    loadTemplate('/static/views/ats/legal.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });

  $('#editPost').click(function() {
    loadTemplate('/static/views/ats/post.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });

  $('#editContract').click(function() {
    loadTemplate('/static/views/ats/contract.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });

  $('#editExperience').click(function() {
    loadTemplate('/static/views/ats/experience.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });

  $('#editDiploma').click(function() {
    loadTemplate('/static/views/ats/diploma.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });

  $('#editQualification').click(function() {
    loadTemplate('/static/views/ats/qualification.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });

  $('#editSkill').click(function() {
    loadTemplate('/static/views/ats/skill.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });

  $('#editIdentity').click(function() {
    loadTemplate('/static/views/ats/identity.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });
};

recapListener();