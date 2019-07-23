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
        createModal({ id: 'showCreatedWishInfos', modal: 'candidate/showCreatedWishInfos', title: 'Confirmation', cantBeClose: true }, () => {
          $('#btnNewWish').attr('onclick', `$(location).attr('href', \`/applications\`)`);
          $('#btnGoToProfile').attr('onclick', `$(location).attr('href', \`/profile\`)`);

        });
      } else {
        notify('errorAddWish');
      }
    }).catch((xhr, status, error) => catchError(xhr, status, error));
  }
};