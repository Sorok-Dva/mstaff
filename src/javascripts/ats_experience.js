function experienceListener(){

  $('.save').click(function() {
    if (verifyInputs()){
      saveDatas(permissions.editMode);
      generateDatasRecap();
      resetForm();
      $('#recap').addClass('d-lg-block');
      notify('xpCreated');
    }
  });

  $('.openRecap').click(() => $('#recap').addClass('d-lg-block'));
  $('.closeRecap').click(() => $('#recap').removeClass('d-lg-block'));

  $('#xpPost').on( 'keyup autocompleteclose', () => {
    if (isInArrayPost()){
      let post = $('#xpPost').val();
      let category = databaseDatas.allPosts.find(item => item.name === post).categoriesPS_id;
      switch (category) {
        case 4:
          setAdministrativeService();
          break;
        case 5:
          setLiberalPost();
          break;
      }
      let currentServices = filterServicesByCategory(databaseDatas.allServices, category);
      createServicesList(currentServices, $('#xpService'));
    } else {
      resetPostRadioService();
    }
  });

  $('#xpOngoing').on('change', (event) => {
    if (event.currentTarget.checked){
      $('#xpEnd').data("DateTimePicker").clear().disable();
    } else {
      $('#xpEnd').data("DateTimePicker").clear().enable();
    }
  });

  $('#backToContract').click(function() {
    let template = selectTemplate(candidateDatas.wish.contractType);
    loadTemplate(`/static/views/ats/${template}.hbs`, {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });

  $('#toDiploma').click(function() {
    if (permissions.recap){
      console.log('hop');
      permissions.recap = false;
      loadTemplate('/static/views/ats/recap.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
        $('#atsPart').html(html);
      })
    } else {
      loadTemplate('/static/views/ats/diploma.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
        $('#atsPart').html(html);
      })
    }
  });
};

function isInArrayPost(){
  let isValidPost = false;
  arrays.posts.forEach( post => {
    if (post.label === $('#xpPost').val())
      isValidPost = true;
  });
  return isValidPost;
};

function isInArrayService(){
  let isValidService = false;
  arrays.services.forEach( service => {
    if (service.label === $('#xpService').val())
      isValidService = true;
  });
  return isValidService;
};

function foundIdByLabel(label){
  let id = null;
  arrays.services.forEach( service => {
    if (service.label === label){
      id = service.value.toString();
    }
  });
  return id;
};

function selectTemplate(savedValue){
  switch (savedValue) {
    case 'cdi-cdd':
      return 'cdiTime';
      break;
    case 'vacation':
      return 'contract';
      break;
    case 'internship':
      return 'internshipTime';
      break;
    default:
      return 'contract';
  }
};

function createPostsList(posts, input){
  arrays.posts = [];
  posts.forEach( post => {
    let item = { label: post.name, value: post.id};
    arrays.posts.push(item);
  });
  arrays.posts.sort();
  input.autocomplete({
    source: arrays.posts,
    minLength: 1,
    select: (event, ui) => {
      event.preventDefault();
      input.val(ui.item.label);
      input.attr('data-id', ui.item.value);
    }
  });
};

function createServicesList(services, input){
  arrays.services = [];
  services.forEach( service => {
    let item = { label: service.name, value: service.id};
    arrays.services.push(item);
  });
  arrays.services.sort();
  input.autocomplete({
    source: arrays.services,
    minLength: 1,
    select: (event, ui) => {
      event.preventDefault();
      input.val(ui.item.label);
      input.attr('data-id', ui.item.value);
    }
  });
};

function filterServicesByCategory(services ,category){
  let filteredServices = [];
  services.forEach( service => {
    if (service.categoriesPS_id === category)
      filteredServices.push({name: service.name, id: service.id});
    if (service.categoriesPS_id === 2 && category === 3)
      filteredServices.push({name: service.name, id: service.id});
  });
  return filteredServices;
};

function resetForm(){
  $('#experienceForm').trigger("reset");
  resetPostRadioService();
  $('#xpEnd').attr('disabled', false);
};

function resetPostRadioService(){
  $('#salaried').attr('disabled', false);
  $('#internship').attr('disabled', false);
  $('#liberal').prop('checked', false);
  $('#xpService').attr('disabled', false);
  $('#xpService').val(null).trigger('change');
};

function setAdministrativeService(){
  $('#xpService').val('Services généraux');
  $('#xpService').attr('disabled', true);
};

function setLiberalPost(){
  $('#liberal').trigger('click');
  $('#salaried').attr('disabled', true);
  $('#internship').attr('disabled', true);
  $('#xpService').val('Services Libéraux');
  $('#xpService').attr('disabled', true);
};

function editXp(id){
  permissions.editMode = true;
  permissions.editId = id;
  let i = candidateDatas.experiences.map(xp => xp.id).indexOf(id);
  resetForm();
  $('#xpEstablishment').val(candidateDatas.experiences[i].name).trigger('keyup');
  $('#xpPost').val(candidateDatas.experiences[i].post_label).trigger('keyup');
  $(`#${candidateDatas.experiences[i].contract}`).trigger('click');
  $('#xpService').val(candidateDatas.experiences[i].service_label).trigger('change');
  $('#xpStart').data("DateTimePicker").date(candidateDatas.experiences[i].start);
  if (candidateDatas.experiences[i].end)
    $('#xpEnd').data("DateTimePicker").date(candidateDatas.experiences[i].end);
  else
    $('#xpOngoing').trigger('click');
  $('#xpDate').trigger('change');
};

function deleteXp(id){
  createModal({ id: 'removeExperienceModal', modal: 'ats/removeExperience', title: 'Confirmation' }, () => {
    $('#btnAtsRemoveExperience').attr('onclick', `validateDeleteExperience(${id})`);
  });
};

function validateDeleteExperience(id){
  resetForm();
  permissions.editMode = false;
  let i = candidateDatas.experiences.map(xp => xp.id).indexOf(id);
  candidateDatas.experiences.splice(i, 1);
  $(`div [data-id=${id}]`).remove();
}

function addToDatasRecap(item){
  let title = `<h3>#Expérience n° ${item.id}</h3>`;
  let customClass = `class="row justify-content-between align-items-center mt-3 recap-item"`;
  let editButton = `<button class="btn padding-0 mr-3" onclick="editXp(${item.id})"><i class="fal fa-edit"></i></button>`;
  let deleteButton = `<button class="btn padding-0" onclick="deleteXp(${item.id})"><i class="fal fa-trash-alt"></i></button>`;
  $(`<div ${customClass} data-id="${item.id}">${title}<div>${editButton}${deleteButton}</div></div>`).appendTo($('.recap'));
};

function generateDatasRecap(){
  $('.recap-item').remove();
  candidateDatas.experiences.forEach( xp => addToDatasRecap(xp));
  $('#recap').addClass('d-lg-block');
};

function verifyInputs(){
  let now = moment().startOf('day');
  let xpOngoing = $('#xpOngoing').prop('checked');
  let xpEtablishment = !$.isEmptyObject($('#xpEstablishment').val()) && $('#xpEstablishment').val().length > 2 ? true : notify('xpEstablishment');
  let xpPost = isInArrayPost() ? true : notify('xpPost');
  let radioContract = ($('#radioContract input:checked').attr('id') !== undefined) ? true : notify('radioContract');
  let xpService = isInArrayService() ? true : notify('xpService');
  let xpStart = $('#xpStart').data("DateTimePicker").date();
  let xpEnd = $('#xpEnd').data("DateTimePicker").date();
  if (xpStart !== null){
    let validXpStart = xpStart.startOf('day').isSameOrBefore(now) ? true : notify('startDateAfterNow');
    let validXpEnd = true;
    if (xpEnd !== null)
      validXpEnd = xpEnd.startOf('day').isSameOrAfter(xpStart.startOf('day')) ? true : notify('endDateBeforeStart');
    if (xpEnd === null && !xpOngoing){
      validXpEnd = notify('xpOngoingNotChecked');
    }
    return (xpEtablishment && xpPost && radioContract && xpService && validXpStart && validXpEnd);
  }
  return notify('noStartDate');
};

function notify(error){
  switch (error) {
    case 'xpEstablishment':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci d'indiquer un établissement (3 caractères minimum).`
      });
      break;
    case 'xpPost':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci d'indiquer un poste valide.`
      });
      break;
    case 'radioContract':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci de sélectionner un type de contrat.`
      });
      break;
    case 'xpService':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci d'indiquer un service valide.`
      });
      break;
    case 'noStartDate':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci d'indiquer une date de début.`
      });
      break;
    case 'startDateAfterNow':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci de choisir une date antérieure ou égale à la date du jour.`
      });
      break;
    case 'endDateBeforeStart':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci de choisir une date de fin postérieure ou égale à celle de départ.`
      });
      break;
    case 'xpOngoingNotChecked':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci d'indiquer une date de fin ou de cocher "Actuellement en poste" le cas échéant.`
      });

      break
    case 'xpCreated':
      notification({
        icon: 'check-circle',
        type: 'success',
        title: 'Expérience ajoutée avec succés.'
      });

      break
  }
  return false;
};

function saveDatas(editMode){
  let current = {};
  let xpStart = $('#xpStart').data("DateTimePicker");
  let xpEnd = $('#xpEnd').data("DateTimePicker")
  if (editMode){
    let experiences = candidateDatas.experiences;
    current = experiences[experiences.map(xp => xp.id).indexOf(permissions.editId)];
  } else {
    current.id = permissions.experienceId;
    permissions.experienceId += 1;
  }
  current.name = $('#xpEstablishment').val();
  current.post_id = $('#xpPost').attr('data-id');
  current.post_label = $('#xpPost').val();
  current.contract = $('#radioContract input:checked').attr('id');
  current.internship = 0;
  current.service_label = $('#xpService').val();
  current.service_id = foundIdByLabel(current.service_label);
  current.start = new Date(xpStart.date());
  xpStart.clear();
  if (xpEnd.date()){
    current.end = new Date(xpEnd.date());
    xpEnd.clear();
    current.current = 0;
  } else {
    current.end = null;
    current.current = 1;
  }
  if (editMode){
    permissions.editMode = false;
  } else {
    candidateDatas.experiences.push(current);
  }
};

function init_experience(){
  experienceListener();
  $('#xpStart, #xpEnd').datetimepicker({
    format: 'D MMMM YYYY',
    useCurrent: false,
    ignoreReadonly: true,
    maxDate: moment().startOf('day')
  });
  createPostsList(databaseDatas.allPosts, $('#xpPost'));
  $('.pop-me-over').tooltip();
};


$(document).ready(() => {
  init_experience();
  if(candidateDatas.experiences.length > 0)
    generateDatasRecap();
});
