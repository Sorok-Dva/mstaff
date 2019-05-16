function skillListener() {
  $('.save').click(function () {
    if (verifyInputs()) {
      saveDatas(permissions.editMode);
      generateDatasRecap();
      resetForm();
    }
  });

  $('.openRecap').click(function () {
    $('#recap').addClass('d-lg-block');
  });

  $('.closeRecap').click(function () {
    $('#recap').removeClass('d-lg-block');
  });

  $('#stars div').on('click',(e) => {
    starsSelector(e.currentTarget.id);
  });

  $('#backToQualification').click(function () {
    loadTemplate('/static/views/ats/qualification.hbs', { candidateDatas, databaseDatas, arrays, permissions }, (html) => {
      $('#atsPart').html(html);
    })
  });

  $('#toIdentity').click(function () {
    loadTemplate('/static/views/ats/identity.hbs', { candidateDatas, databaseDatas, arrays, permissions }, (html) => {
      $('#atsPart').html(html);
    })
  });
}

function resetForm(){
  $('#skillForm').trigger('reset');
  starsSelector('reset');
}

function editSkill(id){

};

function deleteSkill(id){

};

function editSkill(id){
  permissions.editMode = true;
  permissions.editId = id;
  let i = skills.map(skill => skill.id).indexOf(id);
  resetForm('skill');
  $('#skill').val(skills[i].skill).trigger('keyup');
  starsSelector(`star${skills[i].stars}`);
};

function deleteSkill(id){
  resetForm('skill');
  permissions.editMode = false;
  let i = skills.map(skill => skill.id).indexOf(id);
  skills.splice(i, 1);
  $(`div [data-id=${id}]`).remove();
  if (skills.length === 0){
    generateGlobalRecap('skillModal');
  }
};

function addToDatasRecap(item){
let title = `<h3>#Compétence n° ${item.id}</h3>`;
let customClass = `class="row justify-content-between align-items-center mt-3 recap-item"`;
let editButton = `<button class="btn padding-0 mr-3" onclick="editSkill(${item.id})"><i class="fal fa-edit"></i></button>`;
let deleteButton = `<button class="btn padding-0" onclick="deleteSkill(${item.id})"><i class="fal fa-trash-alt"></i></button>`;
$(`<div ${customClass} data-id="${item.id}">${title}<div>${editButton}${deleteButton}</div></div>`).appendTo($('.recap'));
};

function generateDatasRecap(){
  $('.recap-item').remove();
  candidateDatas.skills.forEach( skill => addToDatasRecap(skill));
};

function starsSelector(id){
  $('#stars div i').css('display', 'none');
  switch (id) {
    case 'reset':
      $(`#star1 i:nth-child(1)`).css('display', 'inline-block');
      $(`#star2 i:nth-child(1)`).css('display', 'inline-block');
      $(`#star3 i:nth-child(1)`).css('display', 'inline-block');
      $('#legend').html('Notez-vous !');
      break;
    case 'star1':
      $(`#${id} i:nth-child(2)`).css('display', 'inline-block');
      $(`#star2 i:nth-child(1)`).css('display', 'inline-block');
      $(`#star3 i:nth-child(1)`).css('display', 'inline-block');
      $('#legend').html('Je sais faire avec tutorat');
      break;
    case 'star2':
      $(`#star1 i:nth-child(2)`).css('display', 'inline-block');
      $(`#${id} i:nth-child(2)`).css('display', 'inline-block');
      $(`#star3 i:nth-child(1)`).css('display', 'inline-block');
      $('#legend').html('Je sais faire en autonomie');
      break;
    case 'star3':
      $(`#star1 i:nth-child(2)`).css('display', 'inline-block');
      $(`#star2 i:nth-child(2)`).css('display', 'inline-block');
      $(`#${id} i:nth-child(2)`).css('display', 'inline-block');
      $('#legend').html('Je sais former');
      break;
  }
};

function starsSelected(){
  if ($('#star3 i.fas.fa-star').prop('style').display === 'inline-block')
    return 3;
  if ($('#star2 i.fas.fa-star').prop('style').display === 'inline-block')
    return 2;
  if ($('#star1 i.fas.fa-star').prop('style').display === 'inline-block')
    return 1;
  return 0;
};

function createSkillList(skills, input){
  arrays.skills = [];
  skills.forEach( skill => {
    arrays.skills.push(skill.name);
  });
  arrays.skills.sort();
  input.autocomplete({
    source: arrays.skills,
    minLength: 1
  });
};

function verifyInputs(){
};

function notify(error){
  switch (error) {

  }
  return false;
};

function saveDatas(editMode){
  let current = {};
  if (editMode){
  let qualifications = candidateDatas.qualifications;
  current =  qualifications[qualifications.map(qualification => qualification.id).indexOf(permissions.editId)];
  } else {
  current.id = permissions.qualificationId;
  permissions.qualificationId += 1;
  }
  current.qualification = $('#qualification').val();
  current.start = new Date($('#qualificationStart').data("DateTimePicker").date());
  current.end = null;
  if ($('#qualificationEnd').data("DateTimePicker").date())
  current.end = new Date($('#qualificationEnd').data("DateTimePicker").date());
  if (editMode){
  permissions.editMode = false;
  } else {
  candidateDatas.qualifications.push(current);
  }
};

function init_skill(){
  skillListener();
  createSkillList(databaseDatas.allSkills, $('#skill'));
};

init_skill();
if(candidateDatas.skills.length > 0)
  generateDatasRecap();