function saveContext(){
  offer.context_section.place = $('#place').val();
  offer.context_section.address = $('#address').val();
  offer.context_section.attach = $('#contextAttach').val();
  offer.context_section.website = $('#website').val();
  offer.context_section.pole = $('#contextPole').val();
  offer.context_section.presentation = $('#contextPresentation').trumbowyg('html');
  $('.contextSection').remove();
  load_contextSection();
}

function cancelContext(){
  $('.contextSection').remove();
}

function clearContext(){
  document.getElementById("contextForm").reset();
  $('#contextPresentation').trumbowyg('empty');

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
  $('#contextPresentation').trumbowyg('html', offer.context_section.presentation);
}

$(document).ready(() => {
  inittrumbowyg();
  loadContext();
});