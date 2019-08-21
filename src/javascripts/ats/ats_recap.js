function recapListener(){
  $('#backToIdentity').click(function() {
    $.ajax({ url: `/views/partials/tooltips/emailHint.hbs`, cache: true, success: (source) => {
        Handlebars.registerPartial(`tooltips/emailHint`, source);
        loadTemplate('/views/ats/identity.hbs', { candidateDatas, databaseDatas, arrays, permissions }, (html) => {
          $('#atsPart').html(html);
        })
      }}).catch((xhr, status, error) => catchError(xhr, status, error));
  });

  $('#toLegal').click(function() {
    loadTemplate('/views/ats/legal.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });

  $('#editGroup').click(function() {
    permissions.recap = true;
    loadTemplate('/views/ats/group.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });

  $('#editPost').click(function() {
    permissions.recap = true;
    loadTemplate('/views/ats/post.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });

  $('#editContract').click(function() {
    permissions.recap = true;
    loadTemplate('/views/ats/contract.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });

  $('#editExperience').click(function() {
    permissions.recap = true;
    loadTemplate('/views/ats/experience.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });

  $('#editDiploma').click(function() {
    permissions.recap = true;
    loadTemplate('/views/ats/diploma.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });

  $('#editQualification').click(function() {
    permissions.recap = true;
    loadTemplate('/views/ats/qualification.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });

  $('#editSkill').click(function() {
    permissions.recap = true;
    loadTemplate('/views/ats/skill.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });

  $('#editIdentity').click(function() {
    $.ajax({ url: `/views/partials/tooltips/emailHint.hbs`, cache: true, success: (source) => {
        Handlebars.registerPartial(`tooltips/emailHint`, source);
        loadTemplate('/views/ats/identity.hbs', { candidateDatas, databaseDatas, arrays, permissions }, (html) => {
          $('#atsPart').html(html);
        })
      }}).catch((xhr, status, error) => catchError(xhr, status, error));
  });
}

$(document).ready(() => {
  recapListener();
});
