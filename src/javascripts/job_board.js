function createNewSection(opts){
  let delEvent  = `onclick="deleteSection('${opts.id}')"`;
  let editEvent = `onclick="editSection('${opts.id}')"`;
  let span = `<span>${opts.title}</span><span><i class="fal fa-edit custom-cursor mr-3" ${editEvent}></i><i class="fal fa-trash-alt custom-cursor" ${delEvent}></i></span>`;
  let divInt = `<div class="d-flex justify-content-between">${span}</div>`;
  let liTitle = `<li class="list-group-item section-title">${divInt}</li>`;
  let liItem = `<li class="list-group-item section-item"><div class="text-left"><p class="margin-0 ${opts.firstClass}">${opts.itemLine}</p><p class="margin-0 ${opts.secClass}">${opts.itemSubLine}</p></div></li>`;
  let ul = `<ul class="list-group shadow-grey">${liTitle}${liItem}</ul>`;
  let newSection = `<div id=${opts.id} class="mb-5">${ul}</div>`;
 $('#sectionsPart').append(newSection);
}

function editSection(sectionId){
  let formsPart = $('#formsPart');
  switch (sectionId) {
    case 'natureSection':
      formsPart.children().hide();
      $('.natureSection').show();
      break;
    case 'contextSection':
      formsPart.children().hide();
      $('.contextSection').show();
      break;
    case 'detailsSection':
      formsPart.children().hide();
      $('.detailsSection').show();
      break;
    case 'postDescriptionSection':
      formsPart.children().hide();
      $('.postDescriptionSection').show();
      break;
    case 'requirementSection':
      formsPart.children().hide();
      $('.requirementSection').show();
      break;
    case 'termsSection':
      formsPart.children().hide();
      $('.termsSection').show();
      break;
  }
}

function resetObject(object){
  Object.keys(object).forEach( key => object[key] = '');
}

function deleteSection(sectionId){
  $(`#${sectionId}`).hide();
  $(`.${sectionId}`).hide();
  switch (sectionId) {
    case 'detailsSection':
      resetObject(offer.details_section);
      break;
    case 'postDescriptionSection':
      resetObject(offer.postDescription_section);
      break;
    case 'requirementSection':
      resetObject(offer.prerequisites_section);
      break;
    case 'termsSection':
      resetObject(offer.terms_sections);
      break;
  }
}

function isActiveSection(section){
  return $(`#${section}`).length;
}

function job_boardListener(offer) {

  $('.add-section-title').click( () => {
    let items = $('.add-section-item');
    if (items.css('display') === 'none'){
      items.show();
      $('.chevron').removeClass('fa-chevron-down').addClass('fa-chevron-up');
    } else {
      items.hide();
      $('.chevron').removeClass('fa-chevron-up').addClass('fa-chevron-down');
    }
  });

  $('#addSection li').click( (e) => {
    if (e.currentTarget.id){
      let section = null;
      switch (e.currentTarget.id) {
        case 'addDetails':
          section = 'detailsSection';
          if (!isActiveSection(section))
            createNewSection({
              id: section,
              title: "Détails de l'offre",
              firstClass: 'details-p-1',
              secClass: 'details-p-2',
              itemLine: "Horaires",
              itemSubLine: offer.details_section.schedule
            });
          break;
        case 'addPostDescription':
          section = 'postDescriptionSection';
          if (!isActiveSection(section))
            createNewSection({
              id: section,
              title: "Description du poste",
              firstClass: 'postDescription-p-1',
              secClass: 'postDescription-p-2',
              itemLine: "Présentation du poste",
              itemSubLine: offer.postDescription_section.presentation
            });
          break;
        case 'addRequirement':
          section = 'requirementSection';
          if (!isActiveSection(section))
            createNewSection({
              id: section,
              title: "Prérequis",
              firstClass: 'requirement-p-1',
              secClass: 'requirement-p-2',
              itemLine: "Diplôme",
              itemSubLine: offer.prerequisites_section.diploma
            });
          break;
        case 'addTerms':
          section = 'termsSection';
          if (!isActiveSection(section))
            createNewSection({
              id: section,
              firstClass: 'terms-p-1',
              secClass: 'terms-p-2',
              title: "Modalités de candidature",
              itemLine: "Responsable du recrutement",
              itemSubLine: offer.terms_sections.recruit
            });
          break;
      }
    }
  });

  $('#previewOffer').click( () => {
    createModal({
      id: 'previewOfferModal',
      modal: 'job_board/previewOffer',
      title: "Aperçu de l'offre",
      size: 'modal-lg',
      data: offer
    }, () => {
      //TODO
    });
  });

  $('#saveOffer').click( () => {
    let _csrf = $('meta[name="csrf-token"]').attr('content');

    offer._csrf = _csrf;
    $.post(`/job_board/offer/${offer.id}`, offer, (data) => {
      if (data.status === 'updated'){
        notification({
          icon: 'check-circle',
          type: 'success',
          title: 'Offre enregistrée avec succès'
        });
      } else {
        notification({
          icon: 'exclamation',
          type: 'danger',
          title: "Une erreur est survenue durant l'enregistrement de l'offre"
        });
      }
    }).catch(error => errorsHandler(error));
  });
}

function isEmpty(item){
  let keys = Object.keys(item);
  let isEmpty = true;

  keys.forEach( key => {
    if (item[key])
      isEmpty = false;
  });
  return isEmpty;
}

function load_natureSection(){
  let contractType = null;

  switch (offer.nature_section.contract_type) {
    case 'cdi-cdd':
      contractType = 'CDI';
      break;
    case 'vacation':
      contractType = 'VACATION';
      break;
    case 'internship':
      contractType = 'STAGE';
      break;
  }

  $('.nature-p-1').text(contractType);
  if (offer.nature_section.start !== "") $('.nature-p-2').text('à partir du '.concat(offer.nature_section.start));
}

function load_contextSection(){
  let localisation = offer.context_section.place;
  let address = offer.context_section.address;

  $('.context-p-2').text(localisation.concat(',', address));
}

function load_detailsSection(){
  $('.details-p-2').text(offer.details_section.schedule);
}

function load_postDescriptionSection(){
  let presentation = offer.postDescription_section.presentation;

  $('.postDescription-p-2').html(presentation);
}

function load_requirementSection(){
  let diploma = offer.prerequisites_section.diploma;

  $('.requirement-p-2').text(diploma);
}

function load_termsSection(){
  let recruiter = offer.terms_sections.recruit;

  $('.terms-p-2').text(recruiter);
}

function parseJsonToBoolean(){
  offer.details_section.housing = $.isEmptyObject(offer.details_section.housing) ? '' : JSON.parse(offer.details_section.housing);
  offer.terms_sections.contractual = $.isEmptyObject(offer.terms_sections.contractual) ? '' : JSON.parse(offer.terms_sections.contractual);
  offer.terms_sections.military = $.isEmptyObject(offer.terms_sections.military) ? '' : JSON.parse(offer.terms_sections.military);
}

function load_job_board(){
  parseJsonToBoolean();
}

function inittrumbowyg() {
  $('textarea').trumbowyg({
    lang: 'fr',
    btns: [
      ['undo', 'redo'], // Only supported in Blink browsers
      ['formatting'],
      ['strong', 'em', 'del'],
      ['superscript', 'subscript'],
      ['link'],
      ['insertImage'],
      ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
      ['unorderedList', 'orderedList'],
      ['horizontalRule'],
      ['removeformat']
    ],
    tagsToRemove: ['script', 'link'],
    resetCss: true
  });
}

$(document).ready(() => {
  inittrumbowyg();
  offer.details_section = {};
  if (!_.isNil($('#detailsSchedule').val())) offer.details_section.schedule = $('#detailsSchedule').val();
  if (!_.isNil($('#detailsRoll').val())) offer.details_section.roll = $('#detailsRoll').val();
  if (!_.isNil($('#detailsQuota').val())) offer.details_section.quota = $('#detailsQuota').val();
  if (!_.isNil($('#detailsStrain').val())) offer.details_section.strain = $('#detailsStrain').val();
  if (!_.isNil($('#detailsAccess').val())) offer.details_section.access = $('#detailsAccess').val();
  if (!_.isNil($('#detailsRemuneration').val())) offer.details_section.remuneration = $('#detailsRemuneration').val();
  if (!_.isNil($('#detailsRisk').val())) offer.details_section.risk = $('#detailsRisk').val();
  offer.context_section = {};
  if (!_.isNil($('#place').val())) offer.context_section.place = $('#place').val();
  if (!_.isNil($('#address').val())) offer.context_section.address = $('#address').val();
  if (!_.isNil($('#contextAttach').val())) offer.context_section.attach = $('#contextAttach').val();
  if (!_.isNil($('#website').val()))offer.context_section.website = $('#website').val();
  if (!_.isNil($('#contextPole').val()))offer.context_section.pole = $('#contextPole').val();
  offer.context_section.presentation = $('#contextPresentation').trumbowyg('html');
  if (!_.isNil($('#natureTitle').val()))offer.name = $('#natureTitle').val();
  offer.nature_section = {};
  offer.nature_section.jobSheet = $('#natureJobSheet').trumbowyg('html');
  if (!_.isNil($('#contract_type').val()))offer.nature_section.contract_type = $('#contract_type').val();
  if (!_.isNil($('#start').val()))offer.nature_section.start = $('#start').val();
  if (!_.isNil($('#natureContractDuration').val()))offer.nature_section.contractDuration = $('#natureContractDuration').val();
  if (!_.isNil($('#natureGrade').val()))offer.nature_section.grade = $('#natureGrade').val();
  if (!_.isNil($('#natureCategory').val()))offer.nature_section.category = $('#natureCategory').val();
  offer.postDescription_section = {};
  offer.postDescription_section.presentation = $('#postPresentation').trumbowyg('html');
  if (!_.isNil($('#postTeam').val()))offer.postDescription_section.team = $('#postTeam').val();
  if (!_.isNil($('#postUphill').val()))offer.postDescription_section.uphill = $('#postUphill').val();
  if (!_.isNil($('#postBacking').val()))offer.postDescription_section.backing = $('#postBacking').val();
  if (!_.isNil($('#postExternal').val()))offer.postDescription_section.external = $('#postExternal').val();
  offer.postDescription_section.internal = $('#postInternal').trumbowyg('html');
  if (!_.isNil($('#postInternService').val()))offer.postDescription_section.internService = $('#postInternService').val();
  offer.prerequisites_section = {};
  if (!_.isNil($('#requirementDiploma').val()))offer.prerequisites_section.diploma = $('#requirementDiploma').val();
  offer.prerequisites_section.skills = $('#requirementSkill').trumbowyg('html');
  offer.prerequisites_section.knowledge = $('#requirementKnowledge').trumbowyg('html');
  offer.terms_sections = {};
  if (!_.isNil($('#termsRecruit').val()))offer.terms_sections.recruit = $('#termsRecruit').val();
  if (!_.isNil($('#termsMail').val()))offer.terms_sections.mail = $('#termsMail').val();

  offer.context_section.logo = '/static/assets/images/default_hospital.jpg';

  job_boardListener(offer);
  load_natureSection();
  load_contextSection();

  if (!isEmpty(offer.details_section)){
    $('#addDetails').trigger('click');
    offer.details_section.housing = $('#detailsHousing').prop('checked');
  }
  if (!isEmpty(offer.postDescription_section))
    $('#addPostDescription').trigger('click');
  if (!isEmpty(offer.prerequisites_section))
    $('#addRequirement').trigger('click');
  if (!isEmpty(offer.terms_sections)){
    $('#addTerms').trigger('click');
    offer.terms_sections.contractual = $('#termsContractual').prop('checked');
    offer.terms_sections.military = $('#termsMilitary').prop('checked');
  }

});