arrays = {};

function generateServiceListByCategory(category, input){
  if (category !== undefined) {
    let currentServices = filterServicesByCategory(databaseInfo.services, category);
    createServicesSelect(currentServices, input);
  }
}

function createServicesSelect(services, input){
  input.empty().select2({
    data: services.sort(),
    disabled: false,
    language: {
      inputTooShort: () => { return 'Veuillez entrer 1 ou plusieurs caractères' }
    },
    minimumInputLength: 1,
    minimumResultsForSearch: Infinity
  });
}

function filterServicesByCategory(services ,category){
  let filteredServices = [];
  services.forEach( service => {
    if (service.categoriesPS_id === category)
      filteredServices.push(service.name);
    if (service.categoriesPS_id === 2 && category === 3)
      filteredServices.push(service.name);
  });
  return filteredServices;
}

function init_post()
{
  postListener();
  $('#InputServices').empty().select2({
    placeholder: "Selectionnez un poste pour accéder au service.",
    disabled: true,
  });
  createPostsList(databaseInfo.posts, $('#InputPosts'));
}

function createPostsList(posts, input){
  arrays.posts = [];
  posts.forEach( post => {
    arrays.posts.push(post.name);
  });
  arrays.posts.sort();
  input.autocomplete({
    source: arrays.posts,
    minLength: 1
  });
}

function verifyInputs(){
  return arrays.posts.includes($('#InputPosts').val()) ? true : notify('inputPost');
}

function notify(error){
  if (error === 'inputPost') {
    notification({
      icon: 'exclamation',
      type: 'danger',
      title: 'Informations manquantes :',
      message: `Merci de choisir un poste valide.`
    });
  }
  return false;
}

function saveDatas(){
  let services = $('#InputServices').select2('data');
  data.post = $('#InputPosts').val();
  data.services = [];
  services.forEach( service => {
    data.services.push(service.text);
  });
}

function postListener(){
  $('#backToMain').click(function() {
    loadTemplate('/static/views/onboarding/pool/register.hbs', {data, databaseInfo}, (html) => {
      $('#poolPart').html(html);
    })
  });
  $('#toAvailability').click(function() {
    if (verifyInputs()){
      saveDatas();
      loadTemplate('/static/views/onboarding/pool/availability.hbs', {data, databaseInfo}, (html) => {
        $('#poolPart').html(html);
      });
    }
  });
  $('#InputPosts').on( 'keyup autocompleteclose', () => {
    let isValidPost = arrays.posts.includes($('#InputPosts').val());
    if (isValidPost){
      let post = $('#InputPosts').val();
      let category = databaseInfo.posts.find(item => item.name === post).categoriesPS_id;
      generateServiceListByCategory(category, $('#InputServices'));
    } else {
      $('#InputServices').val(null).trigger('change');
      $('#InputServices').prop('disabled', true);
    }
  });
};

function reload_post(){
  $('#InputPosts').trigger('keyup');
  $('#InputServices').val(candidateDatas.wish.services).trigger('change');
};

$(document).ready(() => {
  init_post();
});