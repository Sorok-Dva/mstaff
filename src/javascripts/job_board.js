function createNewSection(opts){
  let span = `<span>${opts.title}</span><span><i class="fal fa-edit custom-cursor"></i></span>`;
  let divInt = `<div class="d-flex justify-content-between">${span}</div>`;
  let liTitle = `<li class="list-group-item nature-section-title">${divInt}</li>`;
  let liItem = `<li class="list-group-item nature-section-item"><div class="text-left"><p class="margin-0">${opts.itemLine}</p><p class="margin-0">${opts.itemSubLine}</p></div></li>`;
  let ul = `<ul class="list-group shadow-grey">${liTitle}${liItem}</ul>`;
  let newSection = `<div id=${opts.id} class="mb-5">${ul}</div>`;

 $('#sectionsPart').append(newSection);
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
            createNewSection({id: section, title: "Détails de l'offre", itemLine: "Horaires", itemSubLine: "Lundi 7h-19h; Mardi etc"});
          break;
        case 'addPostDescription':
          section = 'postDescriptionSection';
          if (!isActiveSection(section))
            createNewSection({id: section, title: "Description du poste", itemLine: "Présentation du poste", itemSubLine: "Dispenser blablabla"});
          break;
        case 'addRequirement':
          section = 'requirementSection';
          if (!isActiveSection(section))
            createNewSection({id: section, title: "Prérequis", itemLine: "Diplôme", itemSubLine: "Infirmiere diplom d'etat"});
          break;
        case 'addTerms':
          section = 'termsSection';
          if (!isActiveSection(section))
            createNewSection({id: section, title: "Modalités de candidature", itemLine: "Responsable du recrutement", itemSubLine: "Mlle XXX YYY"});
          break;

      }
    }
  })

}


$(document).ready(() => {
  job_boardListener();
});