let postsArray = [];
let servicesArray = [];
let application = {};
let experiences = [];
let experienceID = 1;
let editMode = false;
let toNextModal = false;
let allPosts, allServices;


let initApplication = () => {
  return new Promise( resolve => {
    application.fullTime = false;
    application.partTime = false;
    application.dayTime = false;
    application.nightTime = false;
    allPosts = getPosts();
    allServices = getServices();
    resolve();
  });
};

// Retrieval datas into BDD

let getPosts = () => {
  return new Promise( resolve => {
    $.get('/posts/all', function(posts) {
      allPosts = posts;
      // Quick fix to remove non-break-space (encodeURI to see them)
      allPosts.forEach( post => post.name = post.name.replace(/\s/g,' '));
      resolve(allPosts);
    });
  });
};

let getServices = () => {
  return new Promise( resolve => {
    $.get('/services/all', function(services) {
      allServices = services;
      resolve(allServices);
    });
  });
};

// Initialize Lists

let createPostsList = (posts, input) => {
  postsArray = [];
  posts.forEach( post => {
    postsArray.push(post.name);
  });
  postsArray.sort();
  input.autocomplete({
    source: postsArray,
    minLength: 1
  });
};

let createServicesList = (services, input) => {
  servicesArray = [];
  services.forEach( service => {
    servicesArray.push(service);
  });
  servicesArray.sort();
  input.autocomplete({
    source: servicesArray,
    minLength: 1
  });
};

let createServicesSelect = (services, input) => {
  input.empty().select2({
    data: services.sort(),
    placeholder: "Service(s) ?",
    minimumInputLength: 3,
    minimumResultsForSearch: Infinity
  });
};

// Filter and Generate Lists

let filterServicesByCategory = (services ,category) => {
  let filteredServices = [];
  services.forEach( service => {
    if (service.categoriesPS_id === category)
      filteredServices.push(service.name);
    if (service.categoriesPS_id === 2 && category === 3)
      filteredServices.push(service.name);
  });
  return filteredServices;
};

let generateServiceListByCategory = (category, input) => {
    if (category !== undefined) {
      let currentServices = filterServicesByCategory(allServices, category);
      createServicesSelect(currentServices, input);
    }
};

// Logic to next step

let resetForm = (form) => {
  switch (form) {
    case 'xp':
      $('.inputsXp').trigger("reset");
      $('#xpStart').data("DateTimePicker").clear();
      $('#xpEnd').data("DateTimePicker").clear();
      $('.inputsXp i').hide();
      $('#saveXp').hide();
      break;
  }
};

let transitionToNext = (step) => {
  switch(step) {
    case 'mainModal':
      $('#mainModal').modal('hide');
      $('#postModal').modal('show');
      break;
    case 'postModal':
      $('#postModal').modal('hide');
      $('#contractModal').modal('show');
      break;
    case 'contractModal':
      $('#contractModal').modal('hide');
      if (application.contractType === 'vacation')
        $('#experienceModal').modal('show');
      else
        $('#timeModal').modal('show');
      if (application.contractType === 'cdi'){
        $('#cdiSchedule').css('display', 'flex');
        $('#internshipDate').css('display', 'none');
      } else if (application.contractType === 'internship'){
        $('#cdiSchedule').css('display', 'none');
        $('#internshipDate').css('display', 'flex');
      }
      break;
    case 'timeModal':
      $('#timeModal').modal('hide');
      $('#experienceModal').modal('show');
      break;
  }
};

let verifyStep = (step) => {
  switch (step) {
    case 'postModal':
      return verifyInputPost();
      break;
    case 'contractModal':
      return verifyCheckedContract();
      break;
    case 'timeModalCdi':
      return verifyCheckedSchedule();
      break;
    case 'timeModalInternship':
      return verifyInternshipDate();
      break;
  }
};

let nextStepFrom = (currentStep) => {
  console.log(application);
  toNextModal = true;
  switch (currentStep) {
    case 'mainModal':
      transitionToNext(currentStep);
      if (postsArray.length === 0)
        createPostsList(allPosts, $('#InputPosts'));
    case 'postModal':
      if (verifyStep(currentStep)) {
        application.post = $('#InputPosts').val();
        saveServices();
        transitionToNext(currentStep);
      }
    case 'contractModal':
      if (verifyStep(currentStep)){
        createPostsList(allPosts, $('#xpPost'));
        transitionToNext(currentStep);
        generateRecapGlobal('xp');
      }
    case 'timeModal':
      if (application.contractType === 'cdi'){
        if (verifyStep('timeModalCdi')){
          createPostsList(allPosts, $('#xpPost'));
          transitionToNext(currentStep);
          generateRecapGlobal('xp');
        }
      }
      else if (application.contractType === 'internship'){
        if (verifyStep('timeModalInternship')){
          createPostsList(allPosts, $('#xpPost'));
          transitionToNext(currentStep);
          generateRecapGlobal('xp');
        }
      }
    default:
      toNextModal = false;
  }
};

// GLOBAL FUNCTIONS ---------------------------------------------------------------------------------------

let RecapPost = () => {
  $(`<div class="recap-item" data-step="post"><div>Que recherchez-vous ?</div><div><i class="fas fa-check-circle green center-icon"></i><button class="btn"><i class="fal fa-edit"></i></button></div></div>`).appendTo($('.recap'));
};

let generateRecapGlobal = (step) => {
  $('.recap > p').first().show();
  $('.recap p').last().html('Votre récap');
  switch (step) {
    case 'xp':
      $('.recap-item').remove();
      RecapPost();
      break;
  }
};

// VERIFICATION FUNCTIONS ---------------------------------------------------------------------------------------

let verifyInputPost = () => {
  return postsArray.includes($('#InputPosts').val());
};

let verifyCheckedContract = () => {
  return ($('#cdiToggle').prop('checked') || $('#vacationToggle').prop('checked') || $('#internshipToggle').prop('checked'));
};

let verifyCheckedSchedule = () => {
  return ($('#cdiSchedule input:checked').length !== 0);
};

let verifyInternshipDate = () => {
  let start = $('#start').data("DateTimePicker").date();
  let end = $('#end').data("DateTimePicker").date();
  return (start !== null && end !== null);
};

let verifyInputXpEstablishment = () => {
  return !$.isEmptyObject($('#xpEstablishment').val());
};

let verifyInputXpPost = () => {
  return postsArray.includes($('#xpPost').val());
};

let verifyRadioContract = () => {
  return ($('#radioContract input:checked').attr('id') !== undefined);
};

let verifyInputXpService = () => {
  return servicesArray.includes($('#xpService').val());
};;

let verifyXpDate = () => {
  let start = $('#xpStart').data("DateTimePicker").date();
  let end = $('#xpEnd').data("DateTimePicker").date();
  return (start !== null && end !== null);
};

let verifyXpComplete = () => {
  return (verifyInputXpEstablishment() && verifyInputXpPost() && verifyRadioContract() && verifyInputXpService() && verifyXpDate());
};

// POST-MODAL FUNCTIONS ---------------------------------------------------------------------------------------

let saveServices = () => {
  let services = $('#InputServices').select2('data');

  application.services = [];
  services.forEach( service => {
    application.services.push(service.text);
  });
};

// EXPERIENCE-MODAL FUNCTIONS ---------------------------------------------------------------------------------------

let setLiberalPost = () => {
  $('#liberal').trigger('click');
  $('#salaried').attr('disabled', true);
  $('#internship').attr('disabled', true);
  $('#xpService').val('Services Libéraux');
  $('#xpService').attr('disabled', true);
  $('#xpService').siblings().show();
};

let setAdministrativeService = () => {
  $('#xpService').val('Services généraux');
  $('#xpService').attr('disabled', true);
  $('#xpService').siblings().show();
};

let resetPostRadioService = () => {
  $('#salaried').attr('disabled', false);
  $('#internship').attr('disabled', false);
  $('#liberal').prop('checked', false);
  $('#xpService').attr('disabled', false);
  $('#xpPost').siblings().hide();
  $('#xpService').siblings().hide();
  $('#xpService').val(null).trigger('change');
};

let saveCurrentXp = () => {
  let current = {};
  current.id = experienceID;
  experienceID += 1;
  current.establishment = $('#xpEstablishment').val();
  current.post = $('#xpPost').val();
  current.contract = $('#radioContract input:checked').attr('id');
  current.service = $('#xpService').val();
  current.start = new Date($('#xpStart').data("DateTimePicker").date());
  current.end = new Date($('#xpEnd').data("DateTimePicker").date());
  experiences.push(current);
};

let generateRecapXp = () => {
  let recapParagraphs = $('.recap p');
  recapParagraphs.first().hide();
  recapParagraphs.last().html('Aperçu de vos expériences');
  $('.recap-item').remove();
  experiences.forEach( xp => {
    let title = `<div>#Expérience n°${xp.id}</div>`;
    let editButton = `<button class="btn" onclick="editXp(${xp.id})"><i class="fal fa-edit"></i></button>`;
    let deleteButton = `<button class="btn" onclick="deleteXp(${xp.id})"><i class="fal fa-trash-alt"></i></button>`;
    $(`<div class="recap-item" data-id="${xp.id}">${title}<div>${editButton}${deleteButton}</div></div>`).appendTo($('.recap'));
  });
};

let deleteXp = (id) => {
  let i = experiences.map(xp => xp.id).indexOf(id);
  experiences.splice(i, 1);
  $(`div [data-id=${id}]`).remove();
  if (experiences.length === 0){
    $('#toStep5').hide();
    generateRecapGlobal('xp');
  }
};

let editXp = (id) => {
  editMode = true;
  $('#xpEstablishment').val();
  $('#xpPost').val();
  $('#radioContract input:checked').attr('id');
  $('#xpService').val();
  $('#xpStart').data("DateTimePicker");
  $('#xpEnd').data("DateTimePicker")
};

// LISTENERS ---------------------------------------------------------------------------------------

let mainModalListener = () => {
  $('#toStep1').on('click', () => {
    nextStepFrom('mainModal');
  });
};

let postModalListener = () => {
  $('#postModal').on('hide.bs.modal', function(e) {
    if (!toNextModal)
      $('#mainModal').modal('show');
  });

  $('#InputPosts').on( 'keyup autocompleteclose', () => {
    if (verifyInputPost()){
      let post = $('#InputPosts').val();
      $('#toStep2').show();
      let category = allPosts.find(item => item.name === post).categoriesPS_id;
      generateServiceListByCategory(category, $('#InputServices'));
      $('.select-holder > div').show();
    } else {
      $('#toStep2').hide();
      $('.select-holder > div').hide();
      $('#InputServices').val(null).trigger('change');
    }
  });

  $('#toStep2').on('click', () => {
    nextStepFrom('postModal');
  });
};

let contractModalListener = () => {
  $('#contractModal').on('hide.bs.modal', function() {
    if (!toNextModal)
      $('#postModal').modal('show');
  });

  $('.contractChoices input').bootstrapToggle({
    on: '',
    off: '',
    onstyle: 'success',
    offstyle: 'secondary',
    size: 'lg'
  });

  $('.contractChoices input').change(function(){
    if (this.checked){
      switch(this.id){
        case 'cdiToggle':
          $('#vacationToggle, #internshipToggle').bootstrapToggle('off');
          break;
        case 'vacationToggle':
          $('#cdiToggle, #internshipToggle').bootstrapToggle('off');
          break;
        case 'internshipToggle':
          $('#cdiToggle, #vacationToggle').bootstrapToggle('off');
          break;
      }
      application.contractType = this.name;
      $('#toStep3').show();
    }
    if (!verifyCheckedContract()){
      $('#toStep3').hide();
      delete application.contractType;
    }
  });

  $('#toStep3').on('click', () => {
    nextStepFrom('contractModal');
  });
};

let timeModalListener = () => {
  $('#timeModal').on('hide.bs.modal', function() {
    if (!toNextModal){
      $('#cdiSchedule input').bootstrapToggle('off');
      $('#start').data("DateTimePicker").clear();
      $('#end').data("DateTimePicker").clear();
      $('#contractModal').modal('show');
    }
  });

  $('#cdiSchedule input').bootstrapToggle({
    on: '',
    off: '',
    onstyle: 'success',
    offstyle: 'secondary',
    size: 'lg'
  });
  $('#cdiSchedule').change(function(e) {
    switch(e.target.name){
      case 'full_time':
        application.fullTime = e.target.checked;
        break;
      case 'part_time':
        application.partTime = e.target.checked;
        break;
      case 'day_time':
        application.dayTime = e.target.checked;
        break;
      case 'night_time':
        application.nightTime = e.target.checked;
        break;
    }
    if (verifyCheckedSchedule()){
      $('#toStep4').show();
    } else $('#toStep4').hide();
  });

  $('#internshipDate input').datetimepicker({
    format: 'D MMMM YYYY',
    useCurrent: false,
    ignoreReadonly: true,
  });

  $('#internshipDate input').on('dp.change', (e) => {
    switch (e.currentTarget.id) {
      case 'start':
        $('#end').data("DateTimePicker").minDate(e.date);
        application.start = new Date(e.date);
        break;
      case 'end':
        $('#start').data("DateTimePicker").maxDate(e.date);
        application.end = new Date(e.date);
        break;
    }
    verifyInternshipDate() ? $('#toStep4').show() : $('#toStep4').hide();
  });

  $('#toStep4').on('click', () => {
    nextStepFrom('timeModal');
  });
};

let experienceModalListener = () => {
  $('#experienceModal').on('hide.bs.modal', function() {
    if (!toNextModal){
      $('#contractModal').modal('show');
    }
  });

  //Initialize
  $('#xpDate input').datetimepicker({
    format: 'D MMMM YYYY',
    useCurrent: false,
    ignoreReadonly: true,
    maxDate: moment(),
  })
  .on('dp.change', (e) => {
  switch (e.currentTarget.id) {
    case 'xpStart':
      $('#xpEnd').data("DateTimePicker").minDate(e.date);
      break;
    case 'xpEnd':
      $('#xpStart').data("DateTimePicker").maxDate(e.date);
      break;
  }
});

  //Listeners
  $('#xpEstablishment').on('keyup', () => {
    verifyInputXpEstablishment() ? $('#xpEstablishment').siblings().show() : $('#xpEstablishment').siblings().hide();
  });

  $('#xpPost').on( 'keyup autocompleteclose', () => {
    if (verifyInputXpPost()){
      let post = $('#xpPost').val();
      let category = allPosts.find(item => item.name === post).categoriesPS_id;
      $('#xpPost').siblings().show();
      switch (category) {
        case 4:
          setAdministrativeService();
          break;
        case 5:
          setLiberalPost();
          break;
      }
      let currentServices = filterServicesByCategory(allServices, category);
      createServicesList(currentServices, $('#xpService'));
    } else resetPostRadioService();
  });

  $('#xpService').on('keyup autocompleteclose', () => {
    verifyInputXpService() ? $('#xpService').siblings().show() : $('#xpService').siblings().hide();
  });

  //Verify completion
  $('.inputsXp input').on('change', function (e){
    verifyXpComplete() ? $('#saveXp').show() : $('#saveXp').hide();
  });

  $('#xpDate').on('dp.change', function(e){
    verifyXpComplete() ? $('#saveXp').show() : $('#saveXp').hide();
  });

  $('#saveXp').on('click', () => {
    if (verifyXpComplete()){
      saveCurrentXp();
      generateRecapXp();
      resetForm('xp');
      $('#toStep5').show();
    }
  });

  $('#toStep5').on('click', () => {
    nextStepFrom('experienceModal');
  });
};

$(document).ready(function () {
  initApplication().then( () => {
      mainModalListener();
      postModalListener();
      contractModalListener();
      timeModalListener();
      experienceModalListener();
  });
});
