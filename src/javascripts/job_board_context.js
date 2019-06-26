function saveContext(){
  offer.context_section.place = $('#place').val();
  offer.context_section.address = $('#address').val();
  offer.context_section.attach = $('#contextAttach').val();
  offer.context_section.website = $('#website').val();
  offer.context_section.pole = $('#contextPole').val();
  offer.context_section.presentation = $('#contextPresentation').trumbowyg('html');
  $('.contextSection').hide();
  load_contextSection();
}

function cancelContext(){
  $('.contextSection').hide();
}

function clearContext(){
  document.getElementById("contextForm").reset();
  $('#contextPresentation').trumbowyg('empty');

}

function addLogoContext(){
  console.log('Ajout du logo');
}