function saveRequirement(){
  offer.prerequisites_section.diploma = $('#requirementDiploma').val();
  offer.prerequisites_section.skill = $('#requirementSkill').val();
  offer.prerequisites_section.knowledge = $('#requirementKnowledge').val();

  $('.requirementSection').remove();
  load_requirementSection();
}

function cancelRequirement(){
  $('.requirementSection').remove();
}

function clearRequirement(){
  document.getElementById("requirementForm").reset();
}

function loadRequirement(){
  $('#requirementDiploma').val(offer.prerequisites_section.diploma);
  $('#requirementSkill').val(offer.prerequisites_section.skill);
  $('#requirementKnowledge').val(offer.prerequisites_section.knowledge);
}

$(document).ready(() => {
  loadRequirement();
});