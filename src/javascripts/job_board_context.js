function saveContext(){
  offer.context_section.place = $('#place').val();
  offer.context_section.address = $('#address').val();
  offer.context_section.attach = $('#contextAttach').val();
  offer.context_section.website = $('#website').val();
  offer.context_section.pole = $('#contextPole').val();
  offer.context_section.presentation = $('#contextPresentation').val();
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
  $('#place').val(offer.context_section.place);
  $('#address').val(offer.context_section.address);
  $('#contextAttach').val(offer.context_section.attach);
  $('#website').val(offer.context_section.website);
  $('#contextPole').val(offer.context_section.pole);
  $('#contextPresentation').val(offer.context_section.presentation);
}

$(document).ready(() => {
  loadContext();
});