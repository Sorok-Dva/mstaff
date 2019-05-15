let candidateDatas = {
  application : {},
  identity : {},
  experiences : [],
  diplomas : [],
  qualifications : [],
  skills : [],

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
  diploma: [],
  qualification: [],
  skill: []
};

let permissions = {
  editMode: false,
  editId: 0,
  experienceId: 1,
  diplomaId: 1,
  qualificationId: 1,
  skillId: 1
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
    // candidateDatas.application.post = false;
    // candidateDatas.application.contractType = false;
    // candidateDatas.application.fullTime = false;
    // candidateDatas.application.partTime = false;
    // candidateDatas.application.dayTime = false;
    // candidateDatas.application.nightTime = false;
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