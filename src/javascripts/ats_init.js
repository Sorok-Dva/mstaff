let candidateDatas = {
  wish : {},
  identity : {},
  experiences : [],
  diplomas : [],
  qualifications : [],
  skills : [],
  finess : es_finess
};
let databaseDatas = {
  allPosts : [],
  allServices : [],
  allDiplomas : [],
  allQualifications : [],
  allSkills : [],
};
let arrays = {
  posts: [],
  services: [],
  diplomas: [],
  qualifications: [],
  skills: []
};

let permissions = {
  editMode: false,
  editId: 0,
  experienceId: 1,
  diplomaId: 1,
  qualificationId: 1,
  skillId: 1,
  checkingMail: null,
  verifiedEvent: new Event('verified'),
  recap: false
};


let getAtsDatas = () => {
  return new Promise( resolve => {
    $.get('/atsDatas/all', function(datas) {
      databaseDatas.allPosts = datas.posts;
      databaseDatas.allServices = datas.services;
      databaseDatas.allDiplomas = datas.diplomas;
      databaseDatas.allQualifications = datas.qualifications;
      databaseDatas.allSkills = datas.skills;

      // Quick fix to remove non-break-space (encodeURI to see them)
      databaseDatas.allPosts.forEach( post => post.name = post.name.replace(/\s/g,' '));
      resolve();
    });
  });
};
let initApplication = () => {
  return new Promise( resolve => {
    getAtsDatas().then (() => resolve());
  });
};

$(document).ready(() => {
  initApplication().then( () => {
    loadTemplate('/static/views/ats/main.hbs', {candidateDatas, databaseDatas, arrays, permissions}, (html) => {
      $('#atsPart').html(html);
    })
  });
});