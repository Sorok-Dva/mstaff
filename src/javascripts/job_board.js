function job_boardListener() {

  $('.add-selection-title').click( () => {
    let items = $('.add-selection-item');
    if (items.css('display') === 'none'){
      items.show();
      $('.chevron').removeClass('fa-chevron-down').addClass('fa-chevron-up');
    } else {
      items.hide();
      $('.chevron').removeClass('fa-chevron-up').addClass('fa-chevron-down');
    }
  })

}


$(document).ready(() => {
  job_boardListener();
});