let showCandidateProfileAvailable = true;
let showCandidateProfile = userId => {
  if (showCandidateProfileAvailable) {
    showCandidateProfileAvailable = false;
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
        showCandidateProfileAvailable = true;
      });
    });
  } else {
    notification({
      icon: 'exclamation-circle',
      type: 'warning',
      title: 'Chargement du profil déjà en cours, veuillez patienter quelques instants.'
    })
  }
};