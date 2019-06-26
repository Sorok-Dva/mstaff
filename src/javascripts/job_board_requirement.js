function saveRequirement(){
  if (!_.isNil($('#requirementDiploma').val()))offer.prerequisites_section.diploma = $('#requirementDiploma').val();
  if (!_.isNil($('#requirementSkill').trumbowyg('html')))offer.prerequisites_section.skills = $('#requirementSkill').trumbowyg('html');
  if (!_.isNil($('#requirementKnowledge').trumbowyg('html')))offer.prerequisites_section.knowledge = $('#requirementKnowledge').trumbowyg('html');

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