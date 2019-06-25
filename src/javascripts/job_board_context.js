function saveContext(){
  offerData.context_section.contextLocalisation = $('#contextLocalisation').val();
  offerData.context_section.contextAddress = $('#contextAddress').val();
  offerData.context_section.contextAttach = $('#contextAttach').val();
  offerData.context_section.contextSite = $('#contextSite').val();
  offerData.context_section.contextPole = $('#contextPole').val();
  offerData.context_section.contextPresentation = $('#contextPresentation').val();
  $('.contextSection').remove();
  load_contextSection();
}

function cancelContext(){
  $('.contextSection').remove();
}

function clearContext(){
  document.getElementById("contextForm").reset();
}

function addLogoContext(){
  console.log('Ajout du logo');
}

function loadContext(){
  $('#contextLocalisation').val(offerData.context_section.contextLocalisation);
  $('#contextAddress').val(offerData.context_section.contextAddress);
  $('#contextAttach').val(offerData.context_section.contextAttach);
  $('#contextSite').val(offerData.context_section.contextSite);
  $('#contextPole').val(offerData.context_section.contextPole);
  $('#contextPresentation').val(offerData.context_section.contextPresentation);
}

$(document).ready(() => {
  loadContext();
});