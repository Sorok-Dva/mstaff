function createNewSection(opts){
  let delEvent  = `onclick="deleteSection('${opts.id}')"`;
  let editEvent = `onclick="editSection('${opts.id}')"`;
  let span = `<span>${opts.title}</span><span><i class="fal fa-edit custom-cursor mr-3" ${editEvent}></i><i class="fal fa-trash-alt custom-cursor" ${delEvent}></i></span>`;
  let divInt = `<div class="d-flex justify-content-between">${span}</div>`;
  let liTitle = `<li class="list-group-item nature-section-title">${divInt}</li>`;
  let liItem = `<li class="list-group-item nature-section-item"><div class="text-left"><p class="margin-0 ${opts.firstClass}">${opts.itemLine}</p><p class="margin-0 ${opts.secClass}">${opts.itemSubLine}</p></div></li>`;
  let ul = `<ul class="list-group shadow-grey">${liTitle}${liItem}</ul>`;
  let newSection = `<div id=${opts.id} class="mb-5">${ul}</div>`;
 $('#sectionsPart').append(newSection);
}

function editSection(sectionId){
  let formsPart = $('#formsPart');
  switch (sectionId) {
    case 'natureSection':
      loadTemplate('/static/views/job_board/natureSection.hbs', {offer}, (html) => {
        formsPart.html(html);
      });
      break;
    case 'contextSection':
      loadTemplate('/static/views/job_board/contextSection.hbs', {offer}, (html) => {
        formsPart.html(html);
      });
      break;
    case 'detailsSection':
      loadTemplate('/static/views/job_board/detailsSection.hbs', {offer}, (html) => {
        formsPart.html(html);
      });
      break;
    case 'postDescriptionSection':
      loadTemplate('/static/views/job_board/postDescriptionSection.hbs', {offer}, (html) => {
        formsPart.html(html);
      });
      break;
    case 'requirementSection':
      loadTemplate('/static/views/job_board/requirementSection.hbs', {offer}, (html) => {
        formsPart.html(html);
      });
      break;
    case 'termsSection':
      loadTemplate('/static/views/job_board/termsSection.hbs', {offer}, (html) => {
        formsPart.html(html);
      });
      break;
  }
}

function resetObject(object){
  Object.keys(object).forEach( key => object[key] = '');
}

function deleteSection(sectionId){
  $(`#${sectionId}`).remove();
  $(`.${sectionId}`).remove();
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

function job_boardListener() {

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

function load_natureSection(){
  let contractType = null;
  let startDate = '';

  if (offer.nature_section.start)
    startDate = moment(offer.nature_section.start).format("D/MM/YYYY");

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
  $('.nature-p-2').text('à partir du '.concat(startDate));
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

  $('.postDescription-p-2').text(presentation);
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
  offer.details_section.housing = JSON.parse(offer.details_section.housing);
  offer.terms_sections.contractual = JSON.parse(offer.terms_sections.contractual);
  offer.terms_sections.military = JSON.parse(offer.terms_sections.military);
}

function load_job_board(){
  parseJsonToBoolean();
  load_natureSection();
  load_contextSection();
}

$(document).ready(() => {
  load_job_board();
  job_boardListener();
});