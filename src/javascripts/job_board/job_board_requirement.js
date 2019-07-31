function saveRequirement(){
  offer.prerequisites_section.diploma = $('#requirementDiploma').val();
  offer.prerequisites_section.skill = $('#requirementSkill').trumbowyg('html');
  offer.prerequisites_section.knowledge = $('#requirementKnowledge').trumbowyg('html');

  $('.requirementSection').remove();
  load_requirementSection();
}

function cancelRequirement(){
  $('.requirementSection').remove();
}

function clearRequirement(){
  document.getElementById("requirementForm").reset();
  $('#requirementSkill').trumbowyg('empty');
  $('#requirementKnowledge').trumbowyg('empty');
}

function loadRequirement(){
  $('#requirementDiploma').val(offer.prerequisites_section.diploma);
  $('#requirementSkill').trumbowyg('html', offer.prerequisites_section.skill);
  $('#requirementKnowledge').trumbowyg('html', offer.prerequisites_section.knowledge);
}

$(document).ready(() => {
  inittrumbowyg();
  loadRequirement();
});