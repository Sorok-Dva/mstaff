let postsArray = [];
let application = {};
let toNextModal = false;
let allPosts, allServices;

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

let verifyStep = (step) => {
  switch (step) {
    case 'postModal':
      return verifyInputPost();
      break;
    case 'contractModal':
      return verifyCheckedContract;
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

  $('#cdiToggle, #vacationToggle, #internshipToggle').bootstrapToggle({
    on: '',
    off: '',
    onstyle: 'success',
    offstyle: 'secondary',
    size: 'lg'
  });

  $('#cdiToggle, #vacationToggle, #internshipToggle').change(function(){
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
    if (!toNextModal)
      $('#contractModal').modal('show');
  });

  $('#start').datetimepicker({
    format: 'D MMMM YYYY',
    debug: true
  });
  $('#end').datetimepicker({
    format: 'D MMMM YYYY',
    debug: true
  });

  // $('.from').on('dp.change', (e) => {
  //   if (!e.date)
  //     delete application.start;
  //   else
  //     application.start = new Date(e.date);
  // });
  //
  // $('.to').on('dp.change', (e) => {
  //   if (!e.date)
  //     delete application.end;
  //   else
  //     application.end = new Date(e.date);
  // });
};

$(document).ready(function () {

  mainModalListener();
  postModalListener();
  contractModalListener();
  timeModalListener();

});
