let postsArray = [];
let application = {};
let toNextModal = false;
let allPosts, allServices;

let getPosts = () => {
  return new Promise( resolve => {
    $.get('/posts/all', function(posts) {
      allPosts = posts;
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
  $('#InputServices').select2({
    data: currentServices.sort(),
    minimumInputLength: 3,
    minimumResultsForSearch: Infinity
  });
};

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

let saveServices = () => {
  let services = $('#InputServices').select2('data');

  application.services = [];
  services.forEach( service => {
    application.services.push(service.text);
  });
};

let verifyInputServices = function(){
  let services = $('#InputServices').select2('data');
  if (services.length !== 0)
    return true;
  else
    return false;
};

let verifyInputPost = () => {
  if (postsArray.includes($('#InputPosts').val()))
    return true;
  else
    return false;
};

let verifyStep = (step) => {
  switch (step) {
    case 1:
      return verifyInputPost();
      break;
    case 2:
      return verifyInputServices();
      break;
  }
};

let nextStepFrom = (currentStep) => {
    switch (currentStep) {
      case 0:
        $('#mainModal').modal('hide');
        $('#postModal').modal('show');
        if (postsArray.length === 0)
          getPosts().then(posts => createCurrentPostList(posts));
        break;

      case 1:
        if (verifyStep(currentStep)) {
          application.post = $('#InputPosts').val();
          toNextModal = true;
          $('#postModal').modal('hide');
          $('#serviceModal').modal('show');
          let Category = allPosts.find(item => item.name === application.post).categoriesPS_id;
          generateServiceListByCategory(Category);
        }
        toNextModal = false;
        break;

      case 2:
        if (verifyStep(currentStep)) {
          saveServices();
          toNextModal = true;
          $('#serviceModal').modal('hide');
          $('#contractModal').modal('show');
        }
        toNextModal = false;
        break;
      case 3:
        if (verifyStep(currentStep)){
          toNextModal = true;
        }
        toNextModal = false;
        break;
    }
};

let mainModalListener = () => {
  $('#toStep1').on('click', () => {
    nextStepFrom(0);
  });
};

let postModalListener = () => {
  $('#postModal').on('hide.bs.modal', function(e) {
    if (!toNextModal)
      $('#mainModal').modal('show');
  });

  $('#toStep2').on('click', () => {
    nextStepFrom(1);
  });

  $('#InputPosts').on( 'keyup autocompleteclose', () => {
    if (verifyInputPost()){
      $('.fa-check').show();
      $('#toStep2').show();
    } else {
      $('.fa-check').hide();
      $('#toStep2').hide();
    }
  });
};

let serviceModalListener = () => {
  $('#serviceModal').on('hide.bs.modal', function() {
    if (!toNextModal)
      $('#postModal').modal('show');
  });

  $('#InputServices').on('change', () => {
    verifyInputServices() ? $('#toStep3').show() : $('#toStep3').hide();
  });

  $('#toStep3').on('click', () => {
    nextStepFrom(2);
  });
};

let contractModalListener = () => {
  $('#contractModal').on('hide.bs.modal', function() {
    if (!toNextModal)
      $('#serviceModal').modal('show');
  });

  $('.from').datepicker();
  $('.from').on('dp.change', (e) => {
    if (!e.date)
      delete application.start;
    else
      application.start = new Date(e.date);
  });

  $('.to').datepicker();
  $('.to').on('dp.change', (e) => {
    if (!e.date)
      delete application.end;
    else
      application.end = new Date(e.date);
  });
};

$(document).ready(function () {

  mainModalListener();
  postModalListener();
  serviceModalListener();
  contractModalListener();

});
