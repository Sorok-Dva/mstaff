// let postsArray = [], servicesArray = [], diplomaArray = [], qualificationArray = [], skillArray = [];
// let experiences = [], diplomas = [], qualifications = [], skills = [];
// let application = {};
// let identity = {};
// let permissions = {editMode: false, editId: 0, experienceId: 1, diplomaId: 1, qualificationId: 1, skillId: 1};
let toNextModal = false;
// let allPosts, allServices, allDiplomas, allQualifications, allSkills;
// let iti;
// let checkingMail = null;
// const verifiedEvent = new Event('verified');


// let initApplication = () => {
//   return new Promise( resolve => {
//     application.post = false;
//     application.contractType = false;
//     application.fullTime = false;
//     application.partTime = false;
//     application.dayTime = false;
//     application.nightTime = false;
//     getAtsDatas().then (() => resolve());
//   });
// };

// Retrieval datas into BDD

// let getAtsDatas = () => {
//   return new Promise( resolve => {
//     $.get('/atsDatas/all', function(datas) {
//       allPosts = datas.posts;
//       allServices = datas.services;
//       allDiplomas = datas.diplomas;
//       allQualifications = datas.qualifications;
//       allSkills = datas.skills;
//
//       // Quick fix to remove non-break-space (encodeURI to see them)
//       allPosts.forEach( post => post.name = post.name.replace(/\s/g,' '));
//       resolve();
//     });
//   });
// };

// Initialize Lists

// let createPostsList = (posts, input) => {
//   console.log(posts);
//   // TODO VOIR POUR CALER L ID DANS AUTOCOMPLETE POUR RECUP POUR LA BDD PARCE QUE
//   postsArray = [];
//   posts.forEach( post => {
//     postsArray.push(post.name);
//   });
//   postsArray.sort();
//   input.autocomplete({
//     source: postsArray,
//     minLength: 1,
//     select: (event, ui) => {
//       console.log(ui, event);
//     }
//   });
// };

// let createServicesList = (services, input) => {
//   servicesArray = [];
//   services.forEach( service => {
//     servicesArray.push(service);
//   });
//   servicesArray.sort();
//   input.autocomplete({
//     source: servicesArray,
//     minLength: 1
//   });
// };

// let createDiplomaList = (diplomas, input) => {
//   diplomaArray = [];
//   diplomas.forEach( diploma => {
//     diplomaArray.push(diploma.name);
//   });
//   diplomaArray.sort();
//   input.autocomplete({
//     source: diplomaArray,
//     minLength: 1
//   });
// };

// let createQualificationList = (qualifications, input) => {
//   qualificationArray = [];
//   qualifications.forEach( qualification => {
//     qualificationArray.push(qualification.name);
//   });
//   qualificationArray.sort();
//   input.autocomplete({
//     source: qualificationArray,
//     minLength: 1
//   });
// };

// let createSkillList = (skills, input) => {
//   skillArray = [];
//   skills.forEach( skill => {
//     skillArray.push(skill.name);
//   });
//   skillArray.sort();
//   input.autocomplete({
//     source: skillArray,
//     minLength: 1
//   });
// };

// let createServicesSelect = (services, input) => {
//   input.empty().select2({
//     data: services.sort(),
//     placeholder: "Service(s) ?",
//     minimumInputLength: 1,
//     minimumResultsForSearch: Infinity
//   });
// };

// Filter and Generate Lists

// let filterServicesByCategory = (services ,category) => {
//   let filteredServices = [];
//   services.forEach( service => {
//     if (service.categoriesPS_id === category)
//       filteredServices.push(service.name);
//     if (service.categoriesPS_id === 2 && category === 3)
//       filteredServices.push(service.name);
//   });
//   return filteredServices;
// };

// let generateServiceListByCategory = (category, input) => {
//     if (category !== undefined) {
//       let currentServices = filterServicesByCategory(allServices, category);
//       createServicesSelect(currentServices, input);
//     }
// };

// Logic to next step

// let resetForm = (form) => {
//   switch (form) {
//     // case 'xp':
//     //   $('.inputsXp').trigger("reset");
//     //   $('#xpStart').data("DateTimePicker").clear();
//     //   $('#xpEnd').data("DateTimePicker").clear();
//     //   resetPostRadioService();
//     //   break;
//     // case 'diploma':
//     //   $('.inputsDiploma').trigger("reset");
//     //   $('#diplomaStart').data("DateTimePicker").clear();
//     //   $('#diplomaEnd').data("DateTimePicker").clear();
//     //   break;
//     // case 'qualification':
//     //   $('.inputsQualification').trigger("reset");
//     //   $('#qualificationStart').data("DateTimePicker").clear();
//     //   $('#qualificationEnd').data("DateTimePicker").clear();
//     //   break;
//     // case 'skill':
//     //   $('.inputsSkill').trigger("reset");
//     //   starsSelector('reset');
//     //   break;
//   }
// };

// let toPreviousModal = (current, target) => {
//   if (!toNextModal){
//     loadModal(current, target);
//   }
// };


// GLOBAL FUNCTIONS ---------------------------------------------------------------------------------------

let addToGlobalRecap = (customTitle, colorCheck, currentModal, linkedModal) => {
  let title = `<div>${customTitle}</div>`;
  let check = `<i class="fas fa-check-circle ${colorCheck} center-icon"></i>`;
  let editButton = `<button class="btn" onclick="loadModal('${currentModal}','${linkedModal}')"><i class="fal fa-edit"></i></button>`;
  $(`<div class="recap-item">${title}<div>${check}${editButton}</div></div>`).appendTo($('.recap'));
};

// let addToDatasRecap = (customTitle, item, postfix) => {
//   let title = `<h3>${customTitle} ${item.id}</h3>`;
//   let customClass = `class="row justify-content-between align-items-center mt-3"`;
//   let editButton = `<button class="btn padding-0" onclick="atsEdit${postfix}(${item.id})"><i class="fal fa-edit"></i></button>`;
//   let deleteButton = `<button class="btn padding-0" onclick="atsDelete${postfix}(${item.id})"><i class="fal fa-trash-alt"></i></button>`;
//   $(`<div ${customClass} data-id="${item.id}">${title}<div>${editButton}${deleteButton}</div></div>`).appendTo($('.recap'));
// };

let generateContratRecap = (current) => {
  let color = application.post ? 'green' : 'grey';
  addToGlobalRecap('A quel poste ?', color, current, 'postModal');
};

let generateExperienceRecap = (current) => {
  generateContratRecap(current);
  let color = application.contractType ? 'green' : 'grey';
  addToGlobalRecap('Quel type de contract ?', color, current, 'contractModal');
};

let generateDiplomaRecap = (current) => {
  generateExperienceRecap(current);
  let color = experiences.length > 0 ? 'green' : 'grey';
  addToGlobalRecap('Expériences', color, current, 'experienceModal');
};

let generateQualificationRecap = (current) => {
  generateDiplomaRecap(current);
  let color = diplomas.length > 0 ? 'green' : 'grey';
  addToGlobalRecap('Formations', color, current, 'diplomaModal');
};

let generateSkillRecap = (current) => {
  generateQualificationRecap(current);
  let color = qualifications.length > 0 ? 'green' : 'grey';
  addToGlobalRecap('Diplômes', color, current, 'qualificationModal');
};

let generateGlobalRecap = (current) => {
  let currentParaph = $(`#${current}.recap > p`)
  currentParaph.first().show();
  currentParaph.last().html('Votre récap');
  $('.recap-item').remove();
  switch (current) {
    case 'contractModal':
      generateContratRecap(current);
      break;
    case 'experienceModal':
      generateExperienceRecap(current);
      break;
    case 'diplomaModal':
      generateDiplomaRecap(current);
      break;
    case 'qualificationModal':
      generateQualificationRecap(current);
      break;
    case 'skillModal':
      generateSkillRecap(current);
      break;
  }
};

let generateDatasRecap = (current) => {
  let currentParaph = $(`#${current}.recap > p`)
  currentParaph.first().hide();
  $('.recap-item').remove();
  switch (current) {
    // case 'experienceModal':
    //   $('.recap p').last().html('Aperçu de vos expériences');
    //   experiences.forEach( xp => addToDatasRecap('#Expérience n°', xp, 'Xp'));
    //   break;
    case 'diplomaModal':
      $('.recap p').last().html('Aperçu de vos formations');
      diplomas.forEach( diploma => addToDatasRecap('#Formation n°', diploma, 'Diploma'));
      break;
    case 'qualificationModal':
      $('.recap p').last().html('Aperçu de vos diplômes');
      qualifications.forEach( qualification => addToDatasRecap('#Diplôme n°', qualification, 'Qualification'));
      break;
    case 'skillModal':
      $('.recap p').last().html('Aperçu de vos compétences');
      skills.forEach( skill => addToDatasRecap('#Compétence n°', skill, 'Skill'));
      break;
  }
};

// EXPERIENCE-MODAL FUNCTIONS ---------------------------------------------------------------------------------------

// let setLiberalPost = () => {
//   $('#liberal').trigger('click');
//   $('#salaried').attr('disabled', true);
//   $('#internship').attr('disabled', true);
//   $('#xpService').val('Services Libéraux');
//   $('#xpService').attr('disabled', true);
//   $('#xpService').siblings().show();
// };

// let setAdministrativeService = () => {
//   $('#xpService').val('Services généraux');
//   $('#xpService').attr('disabled', true);
//   $('#xpService').siblings().show();
// };

// let resetPostRadioService = () => {
//   $('#salaried').attr('disabled', false);
//   $('#internship').attr('disabled', false);
//   $('#liberal').prop('checked', false);
//   $('#xpService').attr('disabled', false);
//   $('#xpService').val(null).trigger('change');
// };

// let atsEditXp = (id) => {
//   permissions.editMode = true;
//   permissions.editId = id;
//   let i = experiences.map(xp => xp.id).indexOf(id);
//   resetForm('xp');
//   $('#xpEstablishment').val(experiences[i].establishment).trigger('keyup');
//   $('#xpPost').val(experiences[i].post).trigger('keyup');
//   $(`#${experiences[i].contract}`).trigger('click');
//   $('#xpService').val(experiences[i].service).trigger('change');
//   $('#xpStart').data("DateTimePicker").date(experiences[i].start);
//   if (experiences[i].end)
//     $('#xpEnd').data("DateTimePicker").date(experiences[i].end);
//   $('#xpDate').trigger('change');
// };
//
// let atsDeleteXp = (id) => {
//   resetForm('xp');
//   permissions.editMode = false;
//   let i = experiences.map(xp => xp.id).indexOf(id);
//   experiences.splice(i, 1);
//   $(`div [data-id=${id}]`).remove();
//   if (experiences.length === 0){
//     generateGlobalRecap('experienceModal');
//   }
// };

// DIPLOMA-MODAL FUNCTIONS ---------------------------------------------------------------------------------------

// let atsEditDiploma = (id) => {
//   permissions.editMode = true;
//   permissions.editId = id;
//   let i = diplomas.map(diploma => diploma.id).indexOf(id);
//   resetForm('diploma');
//   $('#diploma').val(diplomas[i].diploma).trigger('keyup');
//   $('#diplomaStart').data("DateTimePicker").date(diplomas[i].start);
//   if (diplomas[i].end)
//     $('#diplomaEnd').data("DateTimePicker").date(diplomas[i].end);
//   $('#diplomaDate').trigger('change');
// };
//
// let atsDeleteDiploma = (id) => {
//   resetForm('diploma');
//   permissions.editMode = false;
//   let i = diplomas.map(diploma => diploma.id).indexOf(id);
//   diplomas.splice(i, 1);
//   $(`div [data-id=${id}]`).remove();
//   if (diplomas.length === 0){
//     generateGlobalRecap('diplomaModal');
//   }
// };

// QUALIFICATION-MODAL FUNCTIONS ---------------------------------------------------------------------------------------

// let atsEditQualification = (id) => {
//   permissions.editMode = true;
//   permissions.editId = id;
//   let i = qualifications.map(qualification => qualification.id).indexOf(id);
//   resetForm('qualification');
//   $('#qualification').val(qualifications[i].qualification).trigger('keyup');
//   $('#qualificationStart').data("DateTimePicker").date(qualifications[i].start);
//   if (qualifications[i].end)
//     $('#qualificationEnd').data("DateTimePicker").date(qualifications[i].end);
//   $('#qualificationDate').trigger('change');
// };

// let atsDeleteQualification = (id) => {
//   resetForm('qualification');
//   permissions.editMode = false;
//   let i = qualifications.map(qualification => qualification.id).indexOf(id);
//   qualifications.splice(i, 1);
//   $(`div [data-id=${id}]`).remove();
//   if (qualifications.length === 0){
//     generateGlobalRecap('qualificationModal');
//   }
// };

// SKILL-MODAL FUNCTIONS ---------------------------------------------------------------------------------------

// let starsSelector = (id) => {
//   $('#stars div i').css('display', 'none');
//   switch (id) {
//     case 'reset':
//       $(`#star1 i:nth-child(1)`).css('display', 'inline-block');
//       $(`#star2 i:nth-child(1)`).css('display', 'inline-block');
//       $(`#star3 i:nth-child(1)`).css('display', 'inline-block');
//       $('#legend').html('Notez-vous !');
//       break;
//     case 'star1':
//       $(`#${id} i:nth-child(2)`).css('display', 'inline-block');
//       $(`#star2 i:nth-child(1)`).css('display', 'inline-block');
//       $(`#star3 i:nth-child(1)`).css('display', 'inline-block');
//       $('#legend').html('Je sais faire avec tutorat');
//       break;
//     case 'star2':
//       $(`#star1 i:nth-child(2)`).css('display', 'inline-block');
//       $(`#${id} i:nth-child(2)`).css('display', 'inline-block');
//       $(`#star3 i:nth-child(1)`).css('display', 'inline-block');
//       $('#legend').html('Je sais faire en autonomie');
//       break;
//     case 'star3':
//       $(`#star1 i:nth-child(2)`).css('display', 'inline-block');
//       $(`#star2 i:nth-child(2)`).css('display', 'inline-block');
//       $(`#${id} i:nth-child(2)`).css('display', 'inline-block');
//       $('#legend').html('Je sais former');
//       break;
//   }
// };

// let starsSelected = () => {
//   if ($('#star3 i.fas.fa-star').prop('style').display === 'inline-block')
//     return 3;
//   if ($('#star2 i.fas.fa-star').prop('style').display === 'inline-block')
//     return 2;
//   if ($('#star1 i.fas.fa-star').prop('style').display === 'inline-block')
//     return 1;
//   return 0;
// };

// let atsEditSkill = (id) => {
//   permissions.editMode = true;
//   permissions.editId = id;
//   let i = skills.map(skill => skill.id).indexOf(id);
//   resetForm('skill');
//   $('#skill').val(skills[i].skill).trigger('keyup');
//   starsSelector(`star${skills[i].stars}`);
// };
//
// let atsDeleteSkill = (id) => {
//   resetForm('skill');
//   permissions.editMode = false;
//   let i = skills.map(skill => skill.id).indexOf(id);
//   skills.splice(i, 1);
//   $(`div [data-id=${id}]`).remove();
//   if (skills.length === 0){
//     generateGlobalRecap('skillModal');
//   }
// };

// IDENTITY-MODAL FUNCTIONS ---------------------------------------------------------------------------------------

// let togglePasswordVisibility = () => {
//   let x = document.getElementById("identityPassword");
//   if (x.type === "password") {
//     x.type = "text";
//   } else {
//     x.type = "password";
//   }
// };

// let displayIndicator = () => {
//   let password = $('#identityPassword').val();
//   let rules = [
//     { Pattern: '[A-Z]', Target: 'uppercase' },
//     { Pattern: '[0-9]', Target: 'number' },
//     { Pattern: '[!@#$%^&*]', Target: 'symbol' }
//     ];
//
//   $('#length').removeClass('bad-rule good-rule').addClass(password.length < 8 ? 'bad-rule' : 'good-rule');
//   rules.forEach( rule => {
//     $('#' + rule.Target).removeClass('bad-rule good-rule').addClass(new RegExp(rule.Pattern).test(password) ? 'good-rule' : 'bad-rule');
//   });
// };

// RECAP-MODAL FUNCTIONS ---------------------------------------------------------------------------------------

let generateFinalRecap = () => {
  let xp = $('#finalExperience div > i');
  let diploma = $('#finalDiploma div > i');
  let qualif = $('#finalQualification div > i');
  let skill = $('#finalSkill div > i');

  xp.removeClass('final-green final-grey');
  diploma.removeClass('final-green final-grey');
  qualif.removeClass('final-green final-grey');
  skill.removeClass('final-green final-grey');

  experiences.length > 0 ? xp.addClass('final-green') : xp.addClass('final-grey');
  diplomas.length > 0 ? diploma.addClass('final-green') : diploma.addClass('final-grey');
  qualifications.length > 0 ? qualif.addClass('final-green') : qualif.addClass('final-grey');
  skills.length > 0 ? skill.addClass('final-green') : skill.addClass('final-grey');
};

// MAIN FUNCTIONS ---------------------------------------------------------------------------------------

// let loadModal = (current, target) => {
//   toNextModal = true;
//   $(`#${current}`).modal('hide');
//   $(`#${target}`).modal('show');
//   hasDatas(target) ? loadEditModal(target) : loadClearModal(target);
//   toNextModal = false;
// };

let loadClearModal = (target) => {
  generateGlobalRecap(target);
  switch (target) {
    // case 'postModal':
    //   if (postsArray.length === 0)
    //     createPostsList(allPosts, $('#InputPosts'));
    //   break;
    // case 'experienceModal':
    //   createPostsList(allPosts, $('#xpPost'));
    //   break;
    // case 'diplomaModal':
    //   createDiplomaList(allDiplomas, $('#diploma'));
    //   break;
    // case 'qualificationModal':
    //   createQualificationList(allQualifications, $('#qualification'));
    //   break;
    // case 'skillModal':
    //   createSkillList(allSkills, $('#skill'));
    //   break;
    case 'recapModal':
      generateFinalRecap();
      break;
  }

};

// let loadEditModal = (target) => {
//   generateDatasRecap(target);
//   switch (target) {
//     // case 'postModal':
//     //   $('#InputPosts').val(application.post);
//     //   //Load services
//     //   break;
//     case 'timeModal':
//       break;
//     case 'experienceModal':
//       break;
//     case 'diplomaModal':
//       break;
//     case 'otherDiplomaModal':
//       break;
//     case 'skillModal':
//       break;
//     case 'identityModal':
//       break;
//   }
// };

// let hasDatas = (modal) => {
//   switch (modal) {
//     // case 'postModal':
//     //     return !$.isEmptyObject(application.post);
//     //   break;
//     // case 'contractModal':
//     //   break;
//     // case 'timeModal':
//     //   break;
//     case 'experienceModal':
//       return experiences.length > 0;
//       break;
//     case 'diplomaModal':
//       return diplomas.length > 0;
//       break;
//     case 'qualificationModal':
//       return qualifications.length > 0;
//       break;
//     case 'skillModal':
//       return skills.length > 0;
//       break;
//     case 'identityModal':
//       break;
//     case 'recapModal':
//       break;
//   }
// };

// let saveDatas = (modal) => {
//   let current;
//   switch (modal) {
//     // case 'postModal':
//     //   let services = $('#InputServices').select2('data');
//     //   application.post = $('#InputPosts').val();
//     //   application.services = [];
//     //   services.forEach( service => {
//     //     application.services.push(service.text);
//     //   });
//     //   break;
//     // case 'contractModal':
//     //   application.contractType = $('.contractChoices input:checked').prop('name');
//     //   break;
//     // case 'timeModalCdi':
//     //   application.fullTime = $('#full_time').prop('checked');
//     //   application.partTime = $('#part_time').prop('checked');
//     //   application.dayTime = $('#day_time').prop('checked');
//     //   application.nightTime = $('#night_time').prop('checked');
//     //   break;
//     // case 'timeModalInternship':
//     //   application.start = new Date($('#start').data("DateTimePicker").date());
//     //   application.end = new Date($('#end').data("DateTimePicker").date());
//     //   break;
//     // case 'experienceModal':
//     //   current = {};
//     //   current.id = permissions.experienceId;
//     //   permissions.experienceId += 1;
//     //   current.name = $('#xpEstablishment').val();
//     //   current.post_id = $('#xpPost').val();
//     //   // current.contract = $('#radioContract input:checked').attr('id');
//     //   //Todo a modifier par la suite (voir si on reste sur cette structure)
//     //   current.internship = 0;
//     //   current.service_id = $('#xpService').val();
//     //   current.start = new Date($('#xpStart').data("DateTimePicker").date());
//     //   current.end = null;
//     //   if ($('#xpEnd').data("DateTimePicker").date())
//     //     current.end = new Date($('#xpEnd').data("DateTimePicker").date());
//     //   experiences.push(current);
//     //   break;
//     // case 'diplomaModal':
//     //   current = {};
//     //   current.id = permissions.diplomaId;
//     //   permissions.diplomaId += 1;
//     //   current.diploma = $('#diploma').val();
//     //   current.start = new Date($('#diplomaStart').data("DateTimePicker").date());
//     //   current.end = null;
//     //   if ($('#diplomaEnd').data("DateTimePicker").date())
//     //     current.end = new Date($('#diplomaEnd').data("DateTimePicker").date());
//     //   diplomas.push(current);
//     //   break;
//     // case 'qualificationModal':
//     //   current = {};
//     //   current.id = permissions.qualificationId;
//     //   permissions.qualificationId += 1;
//     //   current.qualification = $('#qualification').val();
//     //   current.start = new Date($('#qualificationStart').data("DateTimePicker").date());
//     //   current.end = null;
//     //   if ($('#qualificationEnd').data("DateTimePicker").date())
//     //     current.end = new Date($('#qualificationEnd').data("DateTimePicker").date());
//     //   qualifications.push(current);
//     //   break;
//     // case 'skillModal':
//     //   current = {};
//     //   current.id = permissions.skillId;
//     //   permissions.skillId += 1;
//     //   current.skill = $('#skill').val();
//     //   current.stars = starsSelected();
//     //   skills.push(current);
//     //   break;
//     case 'identityModal':
//       identity.firstName = $('#identityForename').val();
//       identity.lastName = $('#identityName').val();
//       identity.phone = iti.getNumber();
//       identity.country = iti.getSelectedCountryData().name;
//       identity.email = $('#identityMail').val();
//       identity.password = $('#identityPassword').val();
//       identity.birthday = $('#identityBirth').val();
//       identity.postal_code = $('#identityPostal').val();
//       identity.town = $('#identityCity').val();
//       break;
//   }
// };

// let saveEditDatas = (modal) => {
//   let current = null;
//   switch (modal) {
//     // case 'experienceModal':
//     //   current = experiences[experiences.map(xp => xp.id).indexOf(permissions.editId)];
//     //   current.establishment = $('#xpEstablishment').val();
//     //   current.post = $('#xpPost').val();
//     //   current.contract = $('#radioContract input:checked').attr('id');
//     //   current.service = $('#xpService').val();
//     //   current.start = new Date($('#xpStart').data("DateTimePicker").date());
//     //   if ($('#xpEnd').data("DateTimePicker").date())
//     //     current.end = new Date($('#xpEnd').data("DateTimePicker").date());
//     //   break;
//     // case 'diplomaModal':
//     //   current =  diplomas[diplomas.map(diploma => diploma.id).indexOf(permissions.editId)];
//     //   current.diploma = $('#diploma').val();
//     //   current.start = new Date($('#diplomaStart').data("DateTimePicker").date());
//     //   if ($('#diplomaEnd').data("DateTimePicker").date())
//     //     current.end = new Date($('#diplomaEnd').data("DateTimePicker").date());
//     //   break;
//     // case 'qualificationModal':
//     //   current =  qualifications[qualifications.map(qualification => qualification.id).indexOf(permissions.editId)];
//     //   current.qualification = $('#qualification').val();
//     //   current.start = new Date($('#qualificationStart').data("DateTimePicker").date());
//     //   if ($('#qualificationEnd').data("DateTimePicker").date())
//     //     current.end = new Date($('#qualificationEnd').data("DateTimePicker").date());
//     //   break;
//     // case 'skillModal':
//     //   current =  skills[skills.map(skill => skill.id).indexOf(permissions.editId)];
//     //   current.skill = $('#skill').val();
//     //   current.stars = starsSelected();
//     //   break;
//   }
//   permissions.editMode = false;
// };

// let isAvailableMail = (mail) => {
//   return new Promise( resolve => {
//     $.get(`/emailAvailable/${mail}`, (data) => {
//       resolve(data);
//     }).catch(error => errorsHandler(error));
//   });
// };

// let verifyDatas = (modal) => {
//   let now = moment().startOf('day');
//   switch (modal) {
//     // case 'postModal':
//     //   return postsArray.includes($('#InputPosts').val()) ? true : notify('inputPost');
//     //   break;
//     // case 'contractModal':
//     //   return ($('.contractChoices input:checked').length) ? true : notify('contractChoice');
//     //   break;
//     // case 'timeModalCdi':
//     //   let fullpart = ($('#full-part input:checked').length > 0) ? true : notify('fullpart');
//     //   let daynight = ($('#day-night input:checked').length > 0) ? true : notify('daynight');
//     //   return (fullpart && daynight);
//     //   break;
//     // case 'timeModalInternship':
//     //   let start = $('#start').data("DateTimePicker").date();
//     //   let end = $('#end').data("DateTimePicker").date();
//     //
//     //   if (start !== null && end !== null){
//     //     let validStart = start.startOf('day').isSameOrAfter(now) ? true : notify('internshipWrongStart');
//     //     let validEnd = end.startOf('day').isAfter(start.startOf('day')) ? true : notify('internshipWrongEnd');
//     //     return (validStart && validEnd);
//     //   }
//     //   return notify('noDateInternship');
//     //   break;
//     // case 'experienceModal':
//     //   let xpEtablishment = !$.isEmptyObject($('#xpEstablishment').val()) ? true : notify('xpEtablishment');
//     //   let xpPost = postsArray.includes($('#xpPost').val()) ? true : notify('xpPost');
//     //   let radioContract = ($('#radioContract input:checked').attr('id') !== undefined) ? true : notify('radioContract');
//     //   let xpService = servicesArray.includes($('#xpService').val()) ? true : notify('xpService');
//     //   let xpStart = $('#xpStart').data("DateTimePicker").date();
//     //   let xpEnd = $('#xpEnd').data("DateTimePicker").date();
//     //   if (xpStart !== null){
//     //     let validXpStart = xpStart.startOf('day').isSameOrBefore(now) ? true : notify('startDateAfterNow');
//     //     let validXpEnd = true;
//     //     if (xpEnd !== null)
//     //       validXpEnd = xpEnd.startOf('day').isSameOrAfter(xpStart.startOf('day')) ? true : notify('endDateBeforeStart');
//     //     return (xpEtablishment && xpPost && radioContract && xpService && validXpStart && validXpEnd);
//     //   }
//     //   return notify('noStartDate');
//     //   break;
//     // case 'diplomaModal':
//     //   let diploma = !$.isEmptyObject($('#diploma').val()) ? true : notify('noDiploma');
//     //   let diplomaStart = $('#diplomaStart').data("DateTimePicker").date();
//     //   let diplomaEnd = $('#diplomaEnd').data("DateTimePicker").date();
//     //   if (diplomaStart !== null){
//     //     let validDiplomaStart = diplomaStart.startOf('day').isSameOrBefore(now) ? true : notify('startDateAfterNow');
//     //     let validDiplomaEnd = true;
//     //     if (diplomaEnd !== null)
//     //       validDiplomaEnd = diplomaEnd.startOf('day').isSameOrAfter(diplomaStart.startOf('day')) ? true : notify('endDateBeforeStart');
//     //     return (diploma && validDiplomaStart && validDiplomaEnd);
//     //   }
//     //   return notify('noStartDate');
//     //   break;
//     // case 'qualificationModal':
//     //   let qualification = !$.isEmptyObject($('#qualification').val()) ? true : notify('noQualification');
//     //   let qualificationStart = $('#qualificationStart').data("DateTimePicker").date();
//     //   let qualificationEnd = $('#qualificationEnd').data("DateTimePicker").date();
//     //   if (qualificationStart !== null){
//     //     let validQualificationStart = qualificationStart.startOf('day').isSameOrBefore(now) ? true : notify('startDateAfterNow');
//     //     let validQualificationEnd = true;
//     //     if (qualificationEnd !== null)
//     //       validQualificationEnd = qualificationEnd.startOf('day').isSameOrAfter(qualificationStart.startOf('day')) ? true : notify('endDateBeforeStart');
//     //     return (qualification && validQualificationStart && validQualificationEnd);
//     //   }
//     //   return notify('noStartDate');
//     //   break;
//     // case 'skillModal':
//     //   let skill = !$.isEmptyObject($('#skill').val()) ? true : notify('noSkill');
//     //   let stars = starsSelected() > 0 ? true : notify('noStars')
//     //   return (skill && stars);
//     //   break;
//     // case 'identityModal':
//     //   let mail = $('#identityMail').val();
//     //   let mailRegex = '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,4})+$';
//     //   let isValidMail = mail.match(mailRegex) !== null ? true : notify('wrongMailFormat');
//     //   if (isValidMail){
//     //     if (mail !== checkingMail){
//     //       checkingMail = mail;
//     //       isAvailableMail(mail).then(data => {
//     //         if (data.available){
//     //           let forename = $('#identityForename').val();
//     //           let name = $('#identityName').val();
//     //           let birthDate = $('#identityBirth').val();
//     //           let postal = $('#identityPostal').val();
//     //           let city = $('#identityCity').val();
//     //           let password = $('#identityPassword').val();
//     //           let isValidForename = !$.isEmptyObject(forename) ? true : notify('noForename');
//     //           let isValidName = !$.isEmptyObject(name) ? true : notify('noName');
//     //           let isValidPostal = !isNaN(postal) ? true : notify('wrongPostalCode');;
//     //           let isValidCity = !$.isEmptyObject(city);
//     //           let isValidBirthDate = new Date(birthDate) !== 'Invalid Date' ? true : notify('wrongBirthDateFormat');
//     //           if (isValidBirthDate)
//     //             isValidBirthDate = moment(birthDate).isBefore(moment().subtract(18, 'years')) ? true : notify('wrongBirthDate');
//     //           let isValidPhone = iti.isValidNumber() ? true : notify('wrongPhoneNumber');
//     //           let passwordRegex = '^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])([!@#$%^&*\\w]{8,})$';
//     //           let isValidPassword = password.match(passwordRegex) !== null ? true : notify('wrongPasswordFormat');
//     //           if (isValidForename && isValidName && isValidPostal && isValidCity && isValidBirthDate && isValidPhone && isValidPassword){
//     //             checkingMail = null;
//     //             document.getElementById('toStep9').dispatchEvent(verifiedEvent);
//     //           }
//     //         }
//     //         else notify('mailAlreadyUse');
//     //       });
//     //     } else {
//     //       notify('mailAlreadyUse');
//     //     }
//     //   }
//     //   break;
//   }
// };

// let notify = (error) => {
//   switch(error) {
//     // case 'inputPost':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Merci de choisir un poste valide.`
//     //   });
//     //   break;
//     // case 'contractChoice':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Merci de sélectionner un type de contrat.`
//     //   });
//     //   break;
//     // case 'fullpart':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Merci d'indiquer si vous souhaitez travailler à temps plein / partiel, ou les deux.`
//     //   });
//     //   break;
//     // case 'daynight':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Merci d'indiquer si vous souhaitez travailler de jour / nuit, ou les deux.`
//     //   });
//     //   break;
//     // case 'internshipWrongStart':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Merci de choisir une date postérieure ou égale à la date du jour.`
//     //   });
//     //   break;
//     // case 'internshipWrongEnd':
//     // notification({
//     //   icon: 'exclamation',
//     //   type: 'danger',
//     //   title: 'Informations manquantes :',
//     //   message: `Merci de choisir une date de fin postérieure à celle de départ.`
//     // });
//     //   break;
//     // case 'xpEtablishment':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Merci d'indiquer un établissement.`
//     //   });
//     //   break;
//     // case 'xpPost':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Merci d'indiquer un poste valide.`
//     //   });
//     //   break;
//     // case 'radioContract':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Merci de sélectionner un type de contrat.`
//     //   });
//     //   break;
//     // case 'xpService':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Merci d'indiquer un service valide.`
//     //   });
//     //   break;
//     // case 'noDateInternship':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Merci d'indiquer une date de début ainsi qu'une date de fin.`
//     //   });
//     //   break;
//     // case 'noStartDate':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Merci d'indiquer une date de début.`
//     //   });
//     //   break;
//     // case 'startDateAfterNow':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Merci de choisir une date antérieure ou égale à la date du jour.`
//     //   });
//     //   break;
//     // case 'endDateBeforeStart':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Merci de choisir une date de fin postérieure ou égale à celle de départ.`
//     //   });
//     //   break;
//     // case 'noDiploma':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Merci d'indiquer une formation.`
//     //   });
//     //   break;
//     // case 'noQualification':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Merci d'indiquer un diplôme.`
//     //   });
//     //   break;
//     // case 'noSkill':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Merci d'indiquer une compétence.`
//     //   });
//     //   break;
//     // case 'noStars':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Merci de noter votre compétence.`
//     //   });
//     //   break;
//     // case 'noForename':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Merci d'indiquer votre prénom.`
//     //   });
//     //   break;
//     // case 'noName':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Merci d'indiquer votre nom.`
//     //   });
//     //   break;
//     // case 'wrongPostalCode':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Merci d'indiquer un code postal valide.`
//     //   });
//     //   break;
//     // case 'wrongBirthDateFormat':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Merci de saisir un format de date valide.`
//     //   });
//     //   break;
//     // case 'wrongBirthDate':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `L'age légal minimum requis pour vous inscrire sur Mstaff est de 18 ans.`
//     //   });
//     //   break;
//     // case 'wrongPhoneNumber':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Merci de saisir un numéro de téléphone valide.`
//     //   });
//     //   break;
//     // case 'wrongMailFormat':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Merci de saisir un mail valide, exemple : identifiant@domain.xxx .`
//     //   });
//     //   break;
//     // case 'wrongPasswordFormat':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Merci de saisir un password valide.`
//     //   });
//     //   break;
//     // case 'mailAlreadyUse':
//     //   notification({
//     //     icon: 'exclamation',
//     //     type: 'danger',
//     //     title: 'Informations manquantes :',
//     //     message: `Cet email est déjà utilisé.`
//     //   });
//     //   break;
//   }
//   return false;
//
// };

let finalize = (es_finess) => {
  identity._csrf = $('#csrfToken').val();
  $.post('/register/', identity, (data) => {
    if (data.result === 'created'){
      if (experiences.length > 0){
        //TODO A FINIR
        $.post('/add/experience', { experiences, _csrf: $('#csrfToken').val() }, (data) => {
          console.log(data);
        });
      }
      console.log(es_finess);
      console.log(application);
      console.log(experiences);
      console.log(diplomas);
      console.log(qualifications);
      console.log(skills);
    }
  }).catch(error => errorsHandler(error));
  //TODO

};

// LISTENERS ---------------------------------------------------------------------------------------

// let mainModalListener = () => {
//   $('#toStep1').on('click', () => {
//     loadModal('mainModal','postModal');
//   });
// };

// let postModalListener = () => {
//   $('#postModal').on('hide.bs.modal', () => toPreviousModal('postModal', 'mainModal'));
//
//   $('#InputPosts').on( 'keyup autocompleteclose', () => {
//     let isValidPost = postsArray.includes($('#InputPosts').val());
//     if (isValidPost){
//       let post = $('#InputPosts').val();
//       let category = allPosts.find(item => item.name === post).categoriesPS_id;
//       generateServiceListByCategory(category, $('#InputServices'));
//       $('.select-holder > div').show();
//     } else {
//       $('.select-holder > div').hide();
//       $('#InputServices').val(null).trigger('change');
//
//     }
//   });
//
//   $('#toStep2').on('click', () => {
//     if (verifyDatas('postModal')){
//       saveDatas('postModal');
//       loadModal('postModal','contractModal');
//     }
//   });
// };

// let contractModalListener = () => {
//   $('#contractModal').on('hide.bs.modal', () => toPreviousModal('contractModal', 'postModal'));
//
//   $('.contractChoices input').bootstrapToggle({
//     on: '',
//     off: '',
//     onstyle: 'success',
//     offstyle: 'secondary',
//     size: 'lg'
//   }).change(function(){
//     if (this.checked){
//       switch(this.id){
//         case 'cdiToggle':
//           $('#vacationToggle, #internshipToggle').bootstrapToggle('off');
//           break;
//         case 'vacationToggle':
//           $('#cdiToggle, #internshipToggle').bootstrapToggle('off');
//           break;
//         case 'internshipToggle':
//           $('#cdiToggle, #vacationToggle').bootstrapToggle('off');
//           break;
//       }
//     }
//   });;
//
//   $('#toStep3').on('click', () => {
//     if (verifyDatas('contractModal')){
//       saveDatas('contractModal');
//       let target = $('.contractChoices input:checked').prop('name');
//       switch (target) {
//         case 'cdi':
//           loadModal('contractModal','timeModal');
//           $('#cdiSchedule').css('display', 'flex');
//           $('#internshipDate').css('display', 'none');
//           break;
//         case 'vacation':
//           loadModal('contractModal','experienceModal');
//           break;
//         case 'internship':
//           loadModal('contractModal','timeModal');
//           $('#cdiSchedule').css('display', 'none');
//           $('#internshipDate').css('display', 'flex');
//           break;
//       }
//     }
//   });
// };

// let timeModalListener = () => {
//   // $('#timeModal').on('hide.bs.modal', () => toPreviousModal('timeModal', 'contractModal'));
//   //
//   // $('#cdiSchedule input').bootstrapToggle({
//   //   on: '',
//   //   off: '',
//   //   onstyle: 'success',
//   //   offstyle: 'secondary',
//   //   size: 'lg'
//   // });
//
//   // $('#internshipDate input').datetimepicker({
//   //   format: 'D MMMM YYYY',
//   //   useCurrent: false,
//   //   ignoreReadonly: true,
//   //   minDate: moment().startOf('day')
//   // });
//
//   // $('#toStep4').on('click', () => {
//   //   let modal = null;
//   //   if (application.contractType === 'cdi')
//   //     modal = 'timeModalCdi';
//   //   else if (application.contractType === 'internship')
//   //     modal = 'timeModalInternship';
//   //   if (verifyDatas(modal)){
//   //     saveDatas(modal);
//   //     loadModal('timeModal','experienceModal');
//   //   }
//   // });
// };

// let experienceModalListener = () => {
//   // $('#experienceModal').on('hide.bs.modal', () => toPreviousModal('experienceModal', 'contractModal'));
//
//   //Initialize
//   // $('#xpDate input').datetimepicker({
//   //   format: 'D MMMM YYYY',
//   //   useCurrent: false,
//   //   ignoreReadonly: true,
//   //   maxDate: moment().startOf('day'),
//   //   widgetPositioning: {vertical: 'top'}
//   // });
//
//   // $('#xpPost').on( 'keyup autocompleteclose', () => {
//   //   let isValidPost = postsArray.includes($('#xpPost').val());
//   //   if (isValidPost){
//   //     let post = $('#xpPost').val();
//   //     let category = allPosts.find(item => item.name === post).categoriesPS_id;
//   //     switch (category) {
//   //       case 4:
//   //         setAdministrativeService();
//   //         break;
//   //       case 5:
//   //         setLiberalPost();
//   //         break;
//   //     }
//   //     let currentServices = filterServicesByCategory(allServices, category);
//   //     createServicesList(currentServices, $('#xpService'));
//   //   } else resetPostRadioService();
//   // });
//
//   $('#saveXp').on('click', () => {
//     if (verifyDatas('experienceModal')){
//       // permissions.editMode ? saveEditDatas('experienceModal') : saveDatas('experienceModal');
//       generateDatasRecap('experienceModal');
//       // resetForm('xp');
//     }
//   });
//
//   // $('#xpOngoing').on('change', (event) => {
//   //   if (event.currentTarget.checked){
//   //   }
//   // });
//
//   //Next Step
//   $('#emptyXp').on('click', () => {
//     experiences = [];
//     loadModal('experienceModal', 'diplomaModal')
//   });
//
//   $('#toStep5').on('click', () => {
//     loadModal('experienceModal','diplomaModal');
//   });
// };

// let diplomaModalListener = () => {
//   // $('#diplomaModal').on('hide.bs.modal', () => toPreviousModal('diplomaModal', 'experienceModal'));
//
//   //Initialize
//   // $('#diplomaDate input').datetimepicker({
//   //   format: 'D MMMM YYYY',
//   //   useCurrent: false,
//   //   ignoreReadonly: true,
//   //   maxDate: moment().startOf('day'),
//   //   widgetPositioning: {vertical: 'top'}
//   // });
//   //
//   // $('#saveDiploma').on('click', () => {
//   //   if (verifyDatas('diplomaModal')){
//   //     permissions.editMode ? saveEditDatas('diplomaModal') : saveDatas('diplomaModal');
//   //     generateDatasRecap('diplomaModal');
//   //     resetForm('diploma');
//   //   }
//   // });
//
//   // $('#emptyDiploma').on('click', () => {
//   //   diplomas = [];
//   //   loadModal('diplomaModal', 'qualificationModal')
//   // });
//
//   // $('#toStep6').on('click', () => {
//   //   loadModal('diplomaModal','qualificationModal');
//   // });
// };

// // let qualificationModalListener = () => {
//   // $('#qualificationModal').on('hide.bs.modal', () => toPreviousModal('qualificationModal', 'diplomaModal'));
//
//   //Initialize
//   // $('#qualificationDate input').datetimepicker({
//   //   format: 'D MMMM YYYY',
//   //   useCurrent: false,
//   //   ignoreReadonly: true,
//   //   maxDate: moment().startOf('day'),
//   //   widgetPositioning: {vertical: 'top'}
//   // });
//
//   $('#saveQualification').on('click', () => {
//     if (verifyDatas('qualificationModal')){
//       permissions.editMode ? saveEditDatas('qualificationModal') : saveDatas('qualificationModal');
//       generateDatasRecap('qualificationModal');
//       resetForm('qualification');
//     }
//   });
//
//   $('#emptyQualification').on('click', () => {
//     qualifications = [];
//     loadModal('qualificationModal', 'skillModal')
//   });
//
//   $('#toStep7').on('click', () => {
//     loadModal('qualificationModal','skillModal');
//   });
// };

// let skillModalListener = () => {
//   // $('#skillModal').on('hide.bs.modal', () => toPreviousModal('skillModal', 'qualificationModal'));
//   //
//   // $('#stars div').on('click',(e) => {
//   //   starsSelector(e.currentTarget.id);
//   // });
//
//   $('#saveSkill').on('click', () => {
//     if (verifyDatas('skillModal')){
//       permissions.editMode ? saveEditDatas('skillModal') : saveDatas('skillModal');
//       generateDatasRecap('skillModal');
//       resetForm('skill');
//     }
//   });
//
//   // $('#emptySkill').on('click', () => {
//   //   skills = [];
//   //   loadModal('skillModal', 'identityModal')
//   // });
//   //
//   // $('#toStep8').on('click', () => {
//   //   loadModal('skillModal','identityModal');
//   // });
//
// };

// let identityModalListener = () => {
//   // $('#identityModal').on('hide.bs.modal', () => toPreviousModal('identityModal', 'skillModal'));
//
//   // let input = document.querySelector("#identityPhone");
//   // let password = $('#identityPassword');
//   // let passwordIndicator = $('.password-indicator ul');
//
//   // iti = intlTelInput(input, {
//   //   utilsScript: '/static/assets/js/utils.js',
//   //   preferredCountries: ["fr", "gb", "us"],
//   //   initialCountry: "auto",
//   //   geoIpLookup: function(success, failure) {
//   //     $.get("https://ipinfo.io", function() {}, "jsonp").always(function(resp) {
//   //       let countryCode = (resp && resp.country) ? resp.country : "";
//   //       success(countryCode);
//   //     });
//   //   },
//   // });
//
//   // password.on('focus', () => {
//   //   passwordIndicator.css('display', 'block');
//   // }).on('blur', () => {
//   //   passwordIndicator.css('display', 'none');
//   // }).on('keyup', () => {
//   //   displayIndicator();
//   // });
//
//   // document.getElementById('toStep9').addEventListener('verified', () => {
//   //   saveDatas('identityModal');
//   //   loadModal('identityModal','recapModal');
//   // }, false);
//   //
//   // $('#toStep9').on('click', () => {
//   //   verifyDatas('identityModal');
//   });
//
// };

let recapModalListener = () => {
  $('#recapModal').on('hide.bs.modal', () => toPreviousModal('recapModal', 'identityModal'));

  $('#toStep10').on('click', () => loadModal('recapModal','legalModal'));
};

let legalModalListener = () => {
  $('#legalModal').on('hide.bs.modal', () => toPreviousModal('legalModal', 'recapModal'));

  $('.final-text input').bootstrapToggle({
    on: '',
    off: '',
    onstyle: 'success',
    offstyle: 'secondary',
    size: 'lg'
  }).change( () => {
    let first = $('#legal-first').prop('checked');
    let second = $('#legal-second').prop('checked');
    let button = $('.final-button button');
    (first && second) ? button.show() : button.hide();
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
    qualificationModalListener();
    skillModalListener();
    identityModalListener();
    recapModalListener();
    legalModalListener();
  });
});