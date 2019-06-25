function saveRequirement(){
  offerData.requirement_section.requirementDiploma = $('#requirementDiploma').val();
  offerData.requirement_section.requirementSkill = $('#requirementSkill').val();
  offerData.requirement_section.requirementKnowledge = $('#requirementKnowledge').val();

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
  $('#requirementDiploma').val(offerData.requirement_section.requirementDiploma);
  $('#requirementSkill').val(offerData.requirement_section.requirementSkill);
  $('#requirementKnowledge').val(offerData.requirement_section.requirementKnowledge);
}

$(document).ready(() => {
  loadRequirement();
});