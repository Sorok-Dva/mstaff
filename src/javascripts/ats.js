let postsArray = [];
let application = {};
let timeOut;
let isValidInputPosts = false;

let getPosts = () => {
  $.get('/posts/all', function(posts) {
    if (posts){
      posts.forEach( post => {
        postsArray.push(post.name);
      });
      $('#InputPosts').autocomplete({
        source: postsArray,
        select: verifyInputPost
      });
    }
  });
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
      }, 500)
    }
    else {
      $('.fa-check').hide();
      isValidInputPosts = false;
    }
  }, 200)
};

$(document).ready(function () {


  $('#postModal').on('show.bs.modal', function(e) {
    $('#mainModal').modal('hide');
    if (postsArray.length === 0)
      getPosts();
  });
  $('#postModal').on('hide.bs.modal', function(e) {
    if (!isValidInputPosts)
      $('#mainModal').modal('show');
  });

  $('#serviceModal').on('show.bs.modal', function(e) {
    $('#postModal').modal('hide');
    isValidInputPosts = false;
    if (postsArray.length === 0)
      getPosts();
  });
  $('#serviceModal').on('hide.bs.modal', function(e) {
    $('#postModal').modal('show');
  });

  $('#InputPosts').on('keyup', verifyInputPost);

});