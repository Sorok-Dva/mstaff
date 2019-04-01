let postsArray = [];
let application = {};
let timeOut;
let isValidInputPosts = false;
let isValidInputServices = false;
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

let verifyInputPost = () => {
  // let inputPosts = $('#InputPosts');

  // if (timeOut)
  //   clearTimeout(timeOut);
  // timeOut = setTimeout(() => {
  if (postsArray.includes($('#InputPosts').val())){
    // isValidInputPosts = true;
    // application.post = inputPosts.val();
    // $('.fa-check').show();
    return true;
    // let nextTimeOut = setTimeout( () => {
    // $('#postModal').modal('hide');
    // $('#serviceModal').modal('show');
    // let IdCategory = allPosts.find(item => item.name === application.post).categoriesPS_id;
    // getServices().then(services => {
    //   if (IdCategory !== undefined){
    //     let currentServices = filterCurrentServices(services, IdCategory);
    //     createCurrentServiceList(currentServices);
    //   }
    // });
        // }, 500)
  }
  else {
    // $('.fa-check').hide();
    return false;
    // isValidInputPosts = false;
  }
  // }, 500)
};

let verifyInputServices = function(){
  let services = $('#InputServices').select2('data');
  if (services.length !== 0){
    $('.fa-arrow-circle-right').show();
    isValidInputServices = true;
  } else {
    $('.fa-arrow-circle-right').hide();
    isValidInputServices = false;
  }
};

let saveServices = () => {
  let services = $('#InputServices').select2('data');

  application.services = [];
  services.forEach( service => {
    application.services.push(service.text);
  });
  $('#serviceModal').modal('hide');
  $('#identityModal').modal('show');
};

let verifyStep = (step) => {
  switch (step) {
    case 1:
      return verifyInputPost();
      break;
  }
};

let changeStep = (currentStep, direction) => {
  if (direction === 'forward'){
    switch (currentStep) {
      case 1:
        if (verifyStep(currentStep)){
          $('#postModal').modal('hide');
          $('#serviceModal').modal('show');
          let IdCategory = allPosts.find(item => item.name === application.post).categoriesPS_id;
          getServices().then(services => {
            if (IdCategory !== undefined){
              let currentServices = filterCurrentServices(services, IdCategory);
              createCurrentServiceList(currentServices);
            }
          });
        }
        else
          console.log('NOTIFY ERROR!');
        break;
    }
  }
  if (verifyStep(currentStep))
    console.log('kahouete');
};

let postModalListener = () => {
  let inputPosts = $('#InputPosts');

  $('#postModal').on('show.bs.modal', () => {
    $('#mainModal').modal('hide');
    if (postsArray.length === 0)
      getPosts().then(posts => createCurrentPostList(posts));
  });

  // $('#postModal').on('hide.bs.modal', function(e) {
  //   if (!isValidInputPosts)
  //     $('#mainModal').modal('show');
  // });

  inputPosts.on('keyup', () => {
    if (verifyInputPost())
      $('.fa-check').show();
    else
      $('.fa-check').hide();
  });

  inputPosts.on('autocompleteclose', () => {
    verifyInputPost() ? $('.fa-check').show() : $('.fa-check').hide();
  });

  $('#toStep2').on('click', () => {
    changeStep(1, 'forward');
  });
};

let serviceModalListener = () => {
  $('#serviceModal').on('show.bs.modal', function(e) {
    $('#postModal').modal('hide');
    isValidInputPosts = false;
  });

  $('#serviceModal').on('hide.bs.modal', function(e) {
    $('#postModal').modal('show');
    if (!isValidInputServices)
      $('#identifyModal').modal('show');
  });

  $('#InputServices').on('change', verifyInputServices);

  $('#toStep3').on('click', saveServices);
};

let identityModalListener = () => {
  $('#identityModal').on('show.bs.modal', function(e) {
    $('#serviceModal').modal('hide');
    isValidInputServices = false;
  });

  $('#identityModal').on('hide.bs.modal', function(e) {
    $('#serviceModal').modal('show');
    isValidInputServices = false;
  });
};

$(document).ready(function () {

  postModalListener();
  serviceModalListener();
  identityModalListener();

});
