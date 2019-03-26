let postsArray = [];
let application = {};
let timeOut;
let isValidInputPosts = false;
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
    minLength: 3,
    select: verifyInputPost
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
  });
  return currentServices;
};


let verifyInputPost = function(e){
  let inputPosts = $('#InputPosts');

  if (timeOut)
    clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    if (postsArray.includes(inputPosts.val())){
      isValidInputPosts = true;
      application.post = inputPosts.val();
      $('.fa-check').show();
      let nextTimeOut = setTimeout( () => {
        $('#postModal').modal('hide');
        $('#serviceModal').modal('show');
        let IdCategory = allPosts.find(item => item.name === application.post).categoriesPS_id;
        getServices().then(services => {
          if (IdCategory !== undefined){
            let currentServices = filterCurrentServices(services, IdCategory);
            createCurrentServiceList(currentServices);
          }
        });
          }, 500)
    }
    else {
      $('.fa-check').hide();
      isValidInputPosts = false;
    }
  }, 500)
};

$(document).ready(function () {


  $('#postModal').on('show.bs.modal', function(e) {
    $('#mainModal').modal('hide');
    if (postsArray.length === 0)
      getPosts().then(posts => createCurrentPostList(posts));
  });
  $('#postModal').on('hide.bs.modal', function(e) {
    if (!isValidInputPosts)
      $('#mainModal').modal('show');
  });

  $('#serviceModal').on('show.bs.modal', function(e) {
    $('#postModal').modal('hide');
    isValidInputPosts = false;
  });
  $('#serviceModal').on('hide.bs.modal', function(e) {
    $('#postModal').modal('show');
  });

  $('#InputPosts').on('keyup', verifyInputPost);

});