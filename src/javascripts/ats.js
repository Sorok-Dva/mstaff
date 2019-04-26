let postsArray = [], servicesArray = [], diplomaArray = [], experiences = [];
let application = {};
let permissions = {editMode: false, editId: 0, experienceId: 1};
let toNextModal = false;
let allPosts, allServices, allDiplomas, allQualifications, allSkills;


let initApplication = () => {
  return new Promise( resolve => {
    application.fullTime = false;
    application.partTime = false;
    application.dayTime = false;
    application.nightTime = false;
    getAtsDatas().then (() => resolve());
  });
};

// Retrieval datas into BDD

let getAtsDatas = () => {
  return new Promise( resolve => {
    $.get('/atsDatas/all', function(datas) {
      allPosts = datas.posts;
      allServices = datas.services;
      allDiplomas = datas.diplomas;
      allQualifications = datas.qualifications;
      allSkills = datas.skills;

      // Quick fix to remove non-break-space (encodeURI to see them)
      allPosts.forEach( post => post.name = post.name.replace(/\s/g,' '));
      resolve();
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

let createDiplomaList = (diplomas, input) => {
  diplomaArray = [];
  diplomas.forEach( diploma => {
    diplomaArray.push(diploma.name);
  });
  diplomaArray.sort();
  input.autocomplete({
    source: diplomaArray,
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
      resetPostRadioService();
      break;
  }
};

let toPreviousModal = (current, target) => {
  if (!toNextModal){
    loadModal(current, target);
  }
};


// GLOBAL FUNCTIONS ---------------------------------------------------------------------------------------

let addToGlobalRecap = (customTitle, colorCheck, currentModal, linkedModal) => {
  let title = `<div>${customTitle}</div>`;
  let check = `<i class="fas fa-check-circle ${colorCheck} center-icon"></i>`;
  let editButton = `<button class="btn" onclick="loadModal('${currentModal}','${linkedModal}')"><i class="fal fa-edit"></i></button>`;
  $(`<div class="recap-item">${title}<div>${check}${editButton}</div></div>`).appendTo($('.recap'));
};

let addToDatasRecap = (customTitle, item) => {
  let title = `<div>${customTitle} ${item.id}</div>`;
  let editButton = `<button class="btn" onclick="editXp(${item.id})"><i class="fal fa-edit"></i></button>`;
  let deleteButton = `<button class="btn" onclick="deleteXp(${item.id})"><i class="fal fa-trash-alt"></i></button>`;
  $(`<div class="recap-item" data-id="${item.id}">${title}<div>${editButton}${deleteButton}</div></div>`).appendTo($('.recap'));
};

let generateGlobalRecap = (current) => {
  let currentParaph = $(`#${current}.recap > p`)
  currentParaph.first().show();
  currentParaph.last().html('Votre récap');
  $('.recap-item').remove();
  switch (current) {
    case 'contractModal':
      addToGlobalRecap('A quel poste ?', 'green', current, 'postModal');
      break;
    case 'experienceModal':
      addToGlobalRecap('A quel poste ?', 'green', current, 'postModal');
      addToGlobalRecap('Quel type de contract ?', 'green', current, 'contractModal');
      break;
    case 'diplomaModal':
      addToGlobalRecap('A quel poste ?', 'green', current, 'postModal');
      addToGlobalRecap('Quel type de contract ?', 'green', current, 'contractModal');
      let color = experiences.length > 0 ? 'green' : 'grey';
      addToGlobalRecap('Expériences', color, current, 'experienceModal');
      break;
  }
};

let generateDatasRecap = (current) => {
  let currentParaph = $(`#${current}.recap > p`)
  currentParaph.first().hide();
  $('.recap-item').remove();
  switch (current) {
    case 'contractModal':
      break;
    case 'experienceModal':
      $('.recap p').last().html('Aperçu de vos expériences');
      experiences.forEach( xp => addToDatasRecap('#Expérience n°', xp));
      break;
    case 'diplomaModal':
      break;
  }
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
  $('#xpService').val(null).trigger('change');
};

let deleteXp = (id) => {
  resetForm('xp');
  permissions.editMode = false;
  let i = experiences.map(xp => xp.id).indexOf(id);
  experiences.splice(i, 1);
  $(`div [data-id=${id}]`).remove();
  if (experiences.length === 0){
    generateGlobalRecap('experienceModal');
  }
};

let editXp = (id) => {
  permissions.editMode = true;
  permissions.editId = id;
  let i = experiences.map(xp => xp.id).indexOf(id);
  resetForm('xp');
  $('#xpEstablishment').val(experiences[i].establishment).trigger('keyup');
  $('#xpPost').val(experiences[i].post).trigger('keyup');
  $(`#${experiences[i].contract}`).trigger('click');
  $('#xpService').val(experiences[i].service).trigger('change');
  $('#xpStart').data("DateTimePicker").date(experiences[i].start);
  if (experiences[i].end)
    $('#xpEnd').data("DateTimePicker").date(experiences[i].end);
  $('#xpDate').trigger('change');
};


// REFACTO FUNCTIONS

let loadModal = (current, target) => {
  console.log(application);
  console.log(experiences);
  toNextModal = true;
  $(`#${current}`).modal('hide');
  $(`#${target}`).modal('show');
  hasDatas(target) ? loadEditModal(target) : loadClearModal(target);
  toNextModal = false;
};

let loadClearModal = (target) => {
  console.log('clear');
  generateGlobalRecap(target);
  switch (target) {
    case 'postModal':
      if (postsArray.length === 0)
        createPostsList(allPosts, $('#InputPosts'));
      break;
    case 'contractModal':
      break;
    case 'timeModal':
      break;
    case 'experienceModal':
      createPostsList(allPosts, $('#xpPost'));
      // generateGlobalRecap('xp');
      break;
    case 'diplomaModal':
      createDiplomaList(allDiplomas, $('#diploma'));
      break;
    case 'otherDiplomaModal':
      break;
    case 'skillModal':
      break;
    case 'identityModal':
      break;
  }

};

let loadEditModal = (target) => {
  console.log('hasDatas');
  generateDatasRecap(target);
  switch (target) {
    case 'postModal':
      $('#InputPosts').val(application.post);
      //Load services
      break;
    case 'contractModal':
      break;
    case 'timeModal':
      break;
    case 'experienceModal':
      break;
    case 'diplomaModal':
      break;
    case 'otherDiplomaModal':
      break;
    case 'skillModal':
      break;
    case 'identityModal':
      break;
  }
};

let hasDatas = (modal) => {
  switch (modal) {
    case 'postModal':
        return !$.isEmptyObject(application.post);
      break;
    case 'contractModal':
      break;
    case 'timeModal':
      break;
    case 'experienceModal':
      return experiences.length > 0;
      break;
    case 'diplomaModal':
      break;
    case 'otherDiplomaModal':
      break;
    case 'skillModal':
      break;
    case 'identityModal':
      break;
  }
};

let saveDatas = (modal) => {
  switch (modal) {
    case 'postModal':
      let services = $('#InputServices').select2('data');
      application.post = $('#InputPosts').val();
      application.services = [];
      services.forEach( service => {
        application.services.push(service.text);
      });
      break;
    case 'contractModal':
      application.contractType = $('.contractChoices input:checked').prop('name');
      break;
    case 'timeModalCdi':
      application.fullTime = $('#full_time').prop('checked');
      application.partTime = $('#part_time').prop('checked');
      application.dayTime = $('#day_time').prop('checked');
      application.nightTime = $('#night_time').prop('checked');
      break;
    case 'timeModalInternship':
      application.start = new Date($('#start').data("DateTimePicker").date());
      application.end = new Date($('#end').data("DateTimePicker").date());
      break;
    case 'experienceModal':
      let current = {};
      current.id = permissions.experienceId;
      permissions.experienceId += 1;
      current.establishment = $('#xpEstablishment').val();
      current.post = $('#xpPost').val();
      current.contract = $('#radioContract input:checked').attr('id');
      current.service = $('#xpService').val();
      current.start = new Date($('#xpStart').data("DateTimePicker").date());
      current.end = null;
      if ($('#xpEnd').data("DateTimePicker").date())
        current.end = new Date($('#xpEnd').data("DateTimePicker").date());
      experiences.push(current);
      break;
    case 'diplomaModal':
      break;
    case 'otherDiplomaModal':
      break;
    case 'skillModal':
      break;
    case 'identityModal':
      break;
  }
};

let saveEditDatas = (modal) => {
  switch (modal) {
    case 'experienceModal':
      let current = experiences[experiences.map(xp => xp.id).indexOf(permissions.editId)];
      current.establishment = $('#xpEstablishment').val();
      current.post = $('#xpPost').val();
      current.contract = $('#radioContract input:checked').attr('id');
      current.service = $('#xpService').val();
      current.start = new Date($('#xpStart').data("DateTimePicker").date());
      if ($('#xpEnd').data("DateTimePicker").date())
        current.end = new Date($('#xpEnd').data("DateTimePicker").date());
      permissions.editMode = false;
      break;
  }
};

let verifyDatas = (modal) => {
  let now = moment().startOf('day');
  switch (modal) {
    case 'postModal':
      return postsArray.includes($('#InputPosts').val()) ? true : notify('inputPost');
      break;
    case 'contractModal':
      return ($('.contractChoices input:checked').length) ? true : notify('contractChoice');
      break;
    case 'timeModalCdi':
      let fullpart = ($('#full-part input:checked').length > 0) ? true : notify('fullpart');
      let daynight = ($('#day-night input:checked').length > 0) ? true : notify('daynight');
      return (fullpart && daynight);
      break;
    case 'timeModalInternship':
      let start = $('#start').data("DateTimePicker").date();
      let end = $('#end').data("DateTimePicker").date();

      if (start !== null && end !== null){
        let validStart = start.startOf('day').isSameOrAfter(now) ? true : notify('internshipWrongStart');
        let validEnd = end.startOf('day').isAfter(start.startOf('day')) ? true : notify('internshipWrongEnd');
        return (validStart && validEnd);
      }
      return notify('noDateInternship');
      break;
    case 'experienceModal':
      let xpEtablishment = !$.isEmptyObject($('#xpEstablishment').val()) ? true : notify('xpEtablishment');
      let xpPost = postsArray.includes($('#xpPost').val()) ? true : notify('xpPost');
      let radioContract = ($('#radioContract input:checked').attr('id') !== undefined) ? true : notify('radioContract');
      let xpService = servicesArray.includes($('#xpService').val()) ? true : notify('xpService');
      let xpStart = $('#xpStart').data("DateTimePicker").date();
      let xpEnd = $('#xpEnd').data("DateTimePicker").date();
      if (xpStart !== null){
        let validXpStart = xpStart.startOf('day').isSameOrBefore(now) ? true : notify('xpWrongStart');
        let validXpEnd = true;
        if (xpEnd !== null)
          validXpEnd = xpEnd.startOf('day').isSameOrAfter(xpStart.startOf('day')) ? true : notify('xpWrongEnd');
        return (xpEtablishment && xpPost && radioContract && xpService && validXpStart && validXpEnd);
      }
      return notify('noXpStartDate');
      break;

  }
};

let notify = (error) => {
  switch(error) {
    case 'inputPost':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci de choisir un poste valide.`
      });
      break;
    case 'contractChoice':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci de sélectionner un type de contrat.`
      });
      break;
    case 'fullpart':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci d'indiquer si vous souhaitez travailler à temps plein / partiel, ou les deux.`
      });
      break;
    case 'daynight':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci d'indiquer si vous souhaitez travailler de jour / nuit, ou les deux.`
      });
      break;
    case 'internshipWrongStart':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci de choisir une date postérieure ou égale à la date du jour.`
      });
      break;
    case 'internshipWrongEnd':
    notification({
      icon: 'exclamation',
      type: 'danger',
      title: 'Informations manquantes :',
      message: `Merci de choisir une date de fin postérieure à celle de départ.`
    });
      break;
    case 'xpEtablishment':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci d'indiquer un établissement.`
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
    case 'noDateInternship':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci d'indiquer une date de début ainsi qu'une date de fin.`
      });
      break;
    case 'noXpStartDate':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci d'indiquer une date de début.`
      });
      break;
    case 'xpWrongStart':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci de choisir une date antérieure ou égale à la date du jour.`
      });
      break;
    case 'xpWrongEnd':
      notification({
        icon: 'exclamation',
        type: 'danger',
        title: 'Informations manquantes :',
        message: `Merci de choisir une date de fin postérieure ou égale à celle de départ.`
      });
      break;
  }
  return false;

};



// LISTENERS ---------------------------------------------------------------------------------------

let mainModalListener = () => {
  $('#toStep1').on('click', () => {
    loadModal('mainModal','postModal');
  });
};

let postModalListener = () => {
  $('#postModal').on('hide.bs.modal', () => toPreviousModal('postModal', 'mainModal'));

  $('#InputPosts').on( 'keyup autocompleteclose', () => {
    let isValidPost = postsArray.includes($('#InputPosts').val());
    if (isValidPost){
      let post = $('#InputPosts').val();
      let category = allPosts.find(item => item.name === post).categoriesPS_id;
      generateServiceListByCategory(category, $('#InputServices'));
      $('.select-holder > div').show();
    } else {
      $('.select-holder > div').hide();
      $('#InputServices').val(null).trigger('change');

    }
  });

  $('#toStep2').on('click', () => {
    if (verifyDatas('postModal')){
      saveDatas('postModal');
      loadModal('postModal','contractModal');
    }
  });
};

let contractModalListener = () => {
  $('#contractModal').on('hide.bs.modal', () => toPreviousModal('contractModal', 'postModal'));

  $('.contractChoices input').bootstrapToggle({
    on: '',
    off: '',
    onstyle: 'success',
    offstyle: 'secondary',
    size: 'lg'
  }).change(function(){
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
    }
  });;

  $('#toStep3').on('click', () => {
    if (verifyDatas('contractModal')){
      saveDatas('contractModal');
      let target = $('.contractChoices input:checked').prop('name');
      switch (target) {
        case 'cdi':
          loadModal('contractModal','timeModal');
          $('#cdiSchedule').css('display', 'flex');
          $('#internshipDate').css('display', 'none');
          break;
        case 'vacation':
          loadModal('contractModal','experienceModal');
          break;
        case 'internship':
          loadModal('contractModal','timeModal');
          $('#cdiSchedule').css('display', 'none');
          $('#internshipDate').css('display', 'flex');
          break;
      }
    }
  });
};

let timeModalListener = () => {
  $('#timeModal').on('hide.bs.modal', () => toPreviousModal('timeModal', 'contractModal'));

  $('#cdiSchedule input').bootstrapToggle({
    on: '',
    off: '',
    onstyle: 'success',
    offstyle: 'secondary',
    size: 'lg'
  });

  $('#internshipDate input').datetimepicker({
    format: 'D MMMM YYYY',
    useCurrent: false,
    ignoreReadonly: true,
    minDate: moment().startOf('day')
  });

  $('#toStep4').on('click', () => {
    let modal = null;
    if (application.contractType === 'cdi')
      modal = 'timeModalCdi';
    else if (application.contractType === 'internship')
      modal = 'timeModalInternship';
    if (verifyDatas(modal)){
      saveDatas(modal);
      loadModal('timeModal','experienceModal');
    }
  });
};

let experienceModalListener = () => {
  $('#experienceModal').on('hide.bs.modal', () => toPreviousModal('experienceModal', 'contractModal'));

  //Initialize
  $('#xpDate input').datetimepicker({
    format: 'D MMMM YYYY',
    useCurrent: false,
    ignoreReadonly: true,
    maxDate: moment().startOf('day'),
  });

  $('#xpPost').on( 'keyup autocompleteclose', () => {
    let isValidPost = postsArray.includes($('#xpPost').val());
    if (isValidPost){
      let post = $('#xpPost').val();
      let category = allPosts.find(item => item.name === post).categoriesPS_id;
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

  $('#saveXp').on('click', () => {
    if (verifyDatas('experienceModal')){
      permissions.editMode ? saveEditDatas('experienceModal') : saveDatas('experienceModal');
      generateDatasRecap('experienceModal');
      resetForm('xp');
    }
  });

  //Next Step
  $('#emptyXp').on('click', () => {
    experiences = [];
    loadModal('experienceModal', 'diplomaModal')
  });

  $('#toStep5').on('click', () => {
    loadModal('experienceModal','diplomaModal');
  });
};

let diplomaModalListener = () => {
  $('#diplomaModal').on('hide.bs.modal', () => toPreviousModal('diplomaModal', 'experienceModal'));

  //Initialize
  $('#diplomaDate input').datetimepicker({
    format: 'D MMMM YYYY',
    useCurrent: false,
    ignoreReadonly: true,
    maxDate: moment().startOf('day'),
  });
};

$(document).ready(function () {
  initApplication().then( () => {
      mainModalListener();
      postModalListener();
      contractModalListener();
      timeModalListener();
      experienceModalListener();
      diplomaModalListener();
  });
});
