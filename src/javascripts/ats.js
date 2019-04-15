let postsArray = [];
let application = {};
let toNextModal = false;
let allPosts, allServices;

let initApplication = () => {
  application.fullTime = false;
  application.partTime = false;
  application.dayTime = false;
  application.nightTime = false;

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

let createCurrentPostList = (allPosts) => {
  allPosts.forEach( post => {
    postsArray.push(post.name);
  });
  postsArray.sort();
  $('#InputPosts').autocomplete({
    source: postsArray,
    minLength: 3
  });
};

let createCurrentServiceList = (currentServices) => {
  $('#InputServices').empty();
  $('#InputServices').select2({
    data: currentServices.sort(),
    placeholder: "Service(s) ?",
    minimumInputLength: 3,
    minimumResultsForSearch: Infinity
  });
};

// Filter and Generate Lists

let filterCurrentServices = (allServices ,category) => {
  let currentServices = [];
  allServices.forEach( service => {
    if (service.categoriesPS_id === category)
      currentServices.push(service.name);
    if (service.categoriesPS_id === 2 && category === 3)
      currentServices.push(service.name);
  });
  return currentServices;
};

let generateServiceListByCategory = (category) => {
  getServices().then(services => {
    if (category !== undefined) {
      let currentServices = filterCurrentServices(services, category);
      createCurrentServiceList(currentServices);
    }
  });
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

let verifyStep = (step) => {
  switch (step) {
    case 'postModal':
      return verifyInputPost();
      break;
    case 'contractModal':
      return verifyCheckedContract();
      break
    case 'timeModal':
      return verifyCheckedSchedule();
      break
  }
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

let nextStepFrom = (currentStep) => {
    console.log(application);
    switch (currentStep) {
      case 'mainModal':
        $('#mainModal').modal('hide');
        $('#postModal').modal('show');
        if (postsArray.length === 0)
          getPosts().then(posts => createCurrentPostList(posts));
        break;

      case 'postModal':
        if (verifyStep(currentStep)) {
          application.post = $('#InputPosts').val();
          saveServices();
          toNextModal = true;
          $('#postModal').modal('hide');
          $('#contractModal').modal('show');
        }
        toNextModal = false;
        break;

      case 'contractModal':
        if (verifyStep(currentStep)){
          toNextModal = true;
          $('#contractModal').modal('hide');
          $('#timeModal').modal('show');
          if (application.contractType === 'cdi'){
            $('#cdiSchedule').css('display', 'flex');
            $('#internshipDate').css('display', 'none');
          } else  if (application.contractType === 'internship'){
            $('#cdiSchedule').css('display', 'none');
            $('#internshipDate').css('display', 'flex');
          } else nextStepFrom('timeModal')
        }
        toNextModal = false;
        break;

      case 'timeModal':
        if (verifyStep(currentStep)){
          toNextModal = true;
          // TODO on ouvre / ferme les fenetres
          console.log('page apres timeModal');
          console.log(application.start);
          console.log(application.end);
        }
        toNextModal = false;
        break;
    }
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
      generateServiceListByCategory(category);
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

$(document).ready(function () {

  initApplication();
  mainModalListener();
  postModalListener();
  contractModalListener();
  timeModalListener();

});
