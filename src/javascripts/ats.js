$(document).ready(function () {

  $('#postModal').on('show.bs.modal', function(e) {
    $('.miniOverlay').addClass('open');
    $('#mainModal').modal('hide');
  });
  $('#postModal').on('hide.bs.modal', function(e) {
    $('.miniOverlay').removeClass('open');
    $('#mainModal').modal();
  });

});