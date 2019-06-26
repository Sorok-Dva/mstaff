function saveTerms(){
  if (!_.isNil($('#termsRecruit').val()))offer.terms_sections.recruit = $('#termsRecruit').val();
  if (!_.isNil($('#termsMail').val()))offer.terms_sections.mail = $('#termsMail').val();
  offer.terms_sections.contractual = $('#termsContractual').prop('checked');
  offer.terms_sections.military = $('#termsMilitary').prop('checked');

  $('.termsSection').hide();
  load_termsSection();
}

function cancelTerms(){
  $('.termsSection').hide();
}

function clearTerms(){
  document.getElementById("termsForm").reset();
}