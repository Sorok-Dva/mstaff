let showCandidateProfile = userId => {
  $.post(`/api/es/1/get/candidate/${userId}`, { _csrf } , data => {
    createModal({
      id: 'viewCandidateProfileModal',
      modal: 'viewCandidateProfile',
      size: 'modal-lg',
      style: 'width:80%',
      title: `Profil de ${data.User.firstName} ${data.User.lastName}`,
      candidate: data
    }, () => {

    });
  });
};