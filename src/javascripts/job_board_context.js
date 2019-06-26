function saveContext(){
  if (!_.isNil($('#place').val())) offer.context_section.place = $('#place').val();
  if (!_.isNil($('#address').val())) offer.context_section.address = $('#address').val();
  if (!_.isNil($('#contextAttach').val())) offer.context_section.attach = $('#contextAttach').val();
  if (!_.isNil($('#website').val()))offer.context_section.website = $('#website').val();
  if (!_.isNil($('#contextPole').val()))offer.context_section.pole = $('#contextPole').val();
  if (!_.isNil($('#contextPresentation').trumbowyg('html')))offer.context_section.presentation = $('#contextPresentation').trumbowyg('html');
  if (!_.isNil($('#natureTitle').val()))offer.name = $('#natureTitle').val();
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