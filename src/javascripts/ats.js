let postsArray = [];
let application = {};
let experiences = [];
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
    minLength: 3
  });
};

let createServicesList = (services, input) => {
  input.empty();
  input.select2({
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
      createServicesList(currentServices, input);
    }
};


// Verification before next step

let verifyInputPost = () => {
  if (postsArray.includes($('#InputPosts').val()))
    return true;
  else
    return false;
};

let verifyCheckedContract = () => {
  if ($('#cdiToggle').prop('checked') || $('#vacationToggle').prop('checked') || $('#internshipToggle').prop('checked'))
    return true;
  else
    return false;
};

let verifyCheckedSchedule = () => {
  if ($('#cdiSchedule input:checked').length !== 0)
    return true;
  else
    return false;
};

let verifyInternshipDate = () => {
  let start = $('#start').data("DateTimePicker").date();
  let end = $('#end').data("DateTimePicker").date();
  if (start !== null && end !== null)
    return true;
  return false;
};

let verifyInputXpPost = () => {
  if (postsArray.includes($('#xpPost').val()))
    return true;
  else
    return false;
};

let verifyXpComplete = () => {
  if (verifyInputXpPost())
    console.log(true);
  else console.log(false);
  console.log($('#xpEstablishment').val());
  console.log($('#xpPost').val());
  console.log($('#radioContract input:checked').attr('id'));
  console.log($('#xpService').val());
  console.log($('#xpStart').data("DateTimePicker").date());
  console.log($('#xpEnd').data("DateTimePicker").date());
};

// Save datas

let saveServices = () => {
  let services = $('#InputServices').select2('data');

  application.services = [];
  services.forEach( service => {
    application.services.push(service.text);
  });
};

// Logic to next step

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
          // getPosts().then(posts => createPostsList(posts, $('#InputPosts')));
        break;

      case 'postModal':
        if (verifyStep(currentStep)) {
          application.post = $('#InputPosts').val();
          saveServices();
          transitionToNext(currentStep);
        }
        break;

      case 'contractModal':
        if (verifyStep(currentStep)){
          createPostsList(allPosts, $('#xpPost'));
          transitionToNext(currentStep);
        }

        break;

      case 'timeModal':
        if (application.contractType === 'cdi')
          verifyStep('timeModalCdi') ? transitionToNext(currentStep) : null;
        else if (application.contractType === 'internship')
          verifyStep('timeModalInternship') ? transitionToNext(currentStep) : null;
        break;
  }
  toNextModal = false;
};

// Listeners

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

  $('#xpDate input').datetimepicker({
    format: 'D MMMM YYYY',
    useCurrent: false,
    ignoreReadonly: true,
  });
  $('#xpDate input').on('dp.change', (e) => {
    switch (e.currentTarget.id) {
      case 'xpStart':
        $('#xpEnd').data("DateTimePicker").minDate(e.date);
        experiences.xpStart = new Date(e.date);
        break;
      case 'xpEnd':
        $('#xpStart').data("DateTimePicker").maxDate(e.date);
        experiences.xpEnd = new Date(e.date);
        break;
    }
  });

  $('#xpPost').on( 'keyup autocompleteclose', () => {
    if (verifyInputXpPost()){
      let post = $('#xpPost').val();
      let category = allPosts.find(item => item.name === post).categoriesPS_id;
      generateServiceListByCategory(category, $('#xpService'));
    } else {
      $('#xpService').val(null).trigger('change');
    }
  });


  $('.inputsXp input').on('change', function (e){
    console.log('Change dans inputsXp');
    verifyXpComplete();
  });
  $('#xpDate').on('dp.change', function(e){
    console.log('Change dans xpDate');
    verifyXpComplete();
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
