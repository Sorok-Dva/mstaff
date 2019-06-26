function saveRequirement(){
  offer.prerequisites_section.diploma = $('#requirementDiploma').val();
  offer.prerequisites_section.skill = $('#requirementSkill').trumbowyg('html');
  offer.prerequisites_section.knowledge = $('#requirementKnowledge').trumbowyg('html');

  $('.requirementSection').hide();
  load_requirementSection();
}

function cancelRequirement(){
  $('.requirementSection').hide();
}

function clearRequirement(){
  document.getElementById("requirementForm").reset();
  $('#requirementSkill').trumbowyg('empty');
  $('#requirementKnowledge').trumbowyg('empty');
}