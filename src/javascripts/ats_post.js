function generateServiceListByCategory(category, input){
  if (category !== undefined) {
    let currentServices = filterServicesByCategory(databaseDatas.allServices, category);
    createServicesSelect(currentServices, input);
  }
};

function filterServicesByCategory(services ,category){
  let filteredServices = [];
  services.forEach( service => {
    if (service.categoriesPS_id === category)
      filteredServices.push(service.name);
    if (service.categoriesPS_id === 2 && category === 3)
      filteredServices.push(service.name);
  });
  return filteredServices;
};

function createServicesSelect(services, input){
  input.empty().select2({
    data: services.sort(),
    placeholder: "Service(s) ?",
    disabled: false,
    minimumInputLength: 1,
    minimumResultsForSearch: Infinity
  });
};

function createPostsList(posts, input){
  // console.log(posts);
  // TODO VOIR POUR CALER L ID DANS AUTOCOMPLETE POUR RECUP POUR LA BDD PARCE QUE
  arrays.posts = [];
  posts.forEach( post => {
    arrays.posts.push(post.name);
  });
  arrays.posts.sort();
  input.autocomplete({
    source: arrays.posts,
    minLength: 1,
    select: (event, ui) => {
      // console.log(ui, event);
    }
  });
};

function verifyInputs(){
  return arrays.posts.includes($('#InputPosts').val()) ? true : notify('inputPost');
};

function notify(error){
  switch (error) {
    case 'inputPost':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci de choisir un poste valide.`
      });
      break;
  }
  return false;
};

function saveDatas(){
  let services = $('#InputServices').select2('data');
  candidateDatas.application.post = $('#InputPosts').val();
  candidateDatas.application.services = [];
  services.forEach( service => {
    candidateDatas.application.services.push(service.text);
  });
};

function postListener(){
  $('#backToMain').click(function() {
    loadTemplate('/static/views/ats/main.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });
  $('#toContract').click(function() {
    if (verifyInputs()){
      saveDatas();
      loadTemplate('/static/views/ats/contract.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
        $('#atsPart').html(html);
      })
    }
  });
  $('#InputPosts').on( 'keyup autocompleteclose', () => {
    let isValidPost = arrays.posts.includes($('#InputPosts').val());
    if (isValidPost){
      let post = $('#InputPosts').val();
      let category = databaseDatas.allPosts.find(item => item.name === post).categoriesPS_id;
      generateServiceListByCategory(category, $('#InputServices'));
    } else {
      $('#InputServices').val(null).trigger('change');
      $('#InputServices').prop('disabled', true);
    }
  });
};

function init_post(){
  postListener();
  $('#InputServices').empty().select2({
    placeholder: "Selectionnez un poste pour accéder au service.",
    disabled: true,
  });
  createPostsList(databaseDatas.allPosts, $('#InputPosts'));
};

function reload_post(){
  $('#InputPosts').trigger('keyup');
  $('#InputServices').val(candidateDatas.application.services).trigger('change');
};

init_post();
if(candidateDatas.application.post)
  reload_post();