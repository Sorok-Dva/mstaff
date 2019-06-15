function groupListener(){
  $('#backToMain').click(function() {
    loadTemplate('/static/views/ats/main.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });
  $('#toPost').click(function() {
    if (verifyInputs()){
      saveDatas();
      if (permissions.recap){
        permissions.recap = false;
        loadTemplate('/static/views/ats/recap.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
          $('#atsPart').html(html);
        })
      } else {
        loadTemplate('/static/views/ats/post.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
          $('#atsPart').html(html);
        })
      }
    }
  });
};

function saveDatas(){
};

function verifyInputs(){
  return true;
};

$(document).ready(() => {
  groupListener();
});