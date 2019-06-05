let showCandidateProfile = userId => {
  $.post(`/api/es/${esId}/get/candidate/${userId}`, { _csrf } , data => {
    createModal({
      id: 'viewCandidateProfileModal',
      modal: 'es/viewCandidateProfile',
      size: 'modal-xl',
      style: 'width:80%',
      title: `Profil de ${data.User.firstName} ${data.User.lastName}`,
      candidate: data,
      partials: ['candidatePercentageTooltip']
    }, () => {

    });
  });
};