let days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
let datas;

let generateCalendarMonths = (moment) => {
  let result = {};
  let date = moment.format('MMMMYYYY').toUpperCase();
  result[date] = [];
  for (let i = 1; i <= moment.daysInMonth(); i++) {
    result[date].push(moment.date(i).format('e'));
  }
  return result;
}

let generateDatasCalendar = (duration) => {
  let result = [];
  for (let i = 0; i < duration; i++) {
    result.push(generateCalendarMonths(moment().add(i, 'months')));
  }
  return result;
}

let generateHTMLCalendar = (datas) => {
  let column = 0;
  let row = 0;
  let leftArrow = '<i class="fal fa-arrow-circle-left"></i>';
  let rightArrow = '<i class="fal fa-arrow-circle-right"></i>';

  datas.forEach(obj => {
    Object.keys(obj).forEach(key => {
      let value = obj[key];
      // Generate calendar skeleton
      $("#vacationDate").append(`<table data-key="${key}" style="display:none" class="text-center table table-striped"></table>`);
      $(`table[data-key="${key}"]`).append(`<thead><tr><th>${leftArrow}</th><th class="text-center" colspan="7">${key}</th><th>${rightArrow}</th></tr><tr data-tr="${key}"></tr></thead>`);
      days.forEach(day => {
        $(`tr[data-tr="${key}"]`).append('<td>' + day + '</td>');
      });
      $(`table[data-key="${key}"]`).append(`<tbody data-tbody="${key}"></tbody>`);

      value.forEach((val, i, array) => {
        let count = array[0];
        if (column % 7 === 0){
          row++;
          $(`tbody[data-tbody="${key}"]`).append(`<tr data-week="${row}"></tr>`);
        }
        // If first row generate empty cells;
        if (i === 0) {
          for (let j = 0; j < count; j++) {
            $(`tr[data-week="${row}"]`).append('<td></td>');
            column++;
          }
        }
        // And then generate calendar
        $(`tr[data-week="${row}"]`).append(`<td><i class="fal fa-sun"></i>${i + 1}<i class="fal fa-moon"></i></td>`);
        column++;
        if (i === value.length - 1)
          column = 0;
      })

    });
  });
}


let switchCalendar = () => {
  $('#vacationDate table').first().show();
}
datas = generateDatasCalendar(24);
generateHTMLCalendar(datas);
switchCalendar();