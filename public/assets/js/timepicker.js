$(document).ready(() => {
  let datePickerOpts = {
    format: 'DD/MM/YYYY',
    useCurrent: false
  };

  $('.datetimepicker').datetimepicker();

  $('.datepicker').datetimepicker(datePickerOpts);

  $('.monthpicker').datetimepicker({
    format: 'MM/YYYY',
    useCurrent: false
  });

  $('.timepicker').datetimepicker({
//          format: 'H:mm',    // use this format if you want the 24hours timepicker
    format: 'h:mm A',    //use this format if you want the 12hours timpiecker with AM/PM toggle
  });

  //from to Datepicker rules
  $('.from').datetimepicker(datePickerOpts).on('dp.change', (e) => {
    let incrementDay = moment(new Date(e.date));
    incrementDay.add(1, 'days');
    $('.to').data('DateTimePicker').minDate(incrementDay);
  });
  $('.to').datetimepicker(datePickerOpts).on('dp.change',  (e) => {
    let decrementDay = moment(new Date(e.date));
    decrementDay.subtract(1, 'days');
    $('.from').data('DateTimePicker').maxDate(decrementDay);
  });
  //XP Datepicker
  $('#xpFrom').datetimepicker().on('dp.change', (e) => {
    let incrementDay = moment(new Date(e.date));
    incrementDay.add(1, 'days');
    $('#xpTo').data('DateTimePicker').minDate(incrementDay);
  });
  $('#xpTo').datetimepicker().on('dp.change',  (e) => {
    let decrementDay = moment(new Date(e.date));
    decrementDay.subtract(1, 'days');
    $('#xpFrom').data('DateTimePicker').maxDate(decrementDay);
  });
  // Formations datepicker
  $('#fFrom').datetimepicker().on('dp.change', (e) => {
    let incrementDay = moment(new Date(e.date));
    incrementDay.add(1, 'days');
    $('#fTo').data('DateTimePicker').minDate(incrementDay);
  });
  $('#fTo').datetimepicker().on('dp.change',  (e) => {
    let decrementDay = moment(new Date(e.date));
    decrementDay.subtract(1, 'days');
    $('#fFrom').data('DateTimePicker').maxDate(decrementDay);
  });
});