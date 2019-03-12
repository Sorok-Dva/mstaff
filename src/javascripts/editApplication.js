let rewritePosts = () => {
  let sPostType = $('#selectPostType');

  let post = sPostType.find(`option:contains(${application.postType})`).val();
  sPostType.val(post).trigger('change.select2');
};

let rewriteServices = () => {
  let sServiceType = $('#selectServiceType');

  let selected = [];
  application.serviceType.forEach( service => {
    selected.push($(`#selectServiceType option:contains(${service})`).val());
  });
  sServiceType.val(selected).trigger('change');
}

$(document).ready(() => {
  rewritePosts();
  rewriteServices();
});