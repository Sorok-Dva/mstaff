ApplicationIsAddMode = true;

let addWish = () => {
  if (application.valid) {
    let opts = {
      name: application.name,
      contractType: application.contractType.name,
      fullTime: (('timeType' in application) && ('fullTime' in application.timeType)),
      partTime: (('timeType' in application) && ('partTime' in application.timeType)),
      dayTime: (('timeType' in application) && ('dayTime' in application.timeType)),
      nightTime: (('timeType' in application) && ('nightTime' in application.timeType)),
      start: application.start,
      end: application.end,
      lat: pos.lat,
      lon: pos.lng,
      es: application.selectedES.toString(),
      es_count: application.selectedES.length,
      posts: application.postType,
      services: application.serviceType,
      _csrf
    };

    $.post('/api/candidate/wish/add', opts, (data) => {
      if (data.wish) {
        $(location).attr('href', `/applications`);
      } else {
        notify('errorAddWish');
      }
    }).catch(error => errorsHandler(error));;
  }
};