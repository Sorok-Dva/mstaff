let getPosts = () => {
  console.log('TODO FINIR ICI');
  $.get('/posts/all', function(posts) {
    console.log(posts);
    if (posts){
      $('#InputPosts').autocomplete({
        source: posts
      });
    }
  });
};

$(document).ready(function () {

  $('#postModal').on('show.bs.modal', function(e) {
    $('.miniOverlay').addClass('open');
    $('#mainModal').modal('hide');
    getPosts();
  });
  $('#postModal').on('hide.bs.modal', function(e) {
    $('.miniOverlay').removeClass('open');
    $('#mainModal').modal();
  });

});