let showCandidateProfileAvailable = true;
let showCandidateApplicationsAvailable = true;

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
        partials: ['tooltips/candidatePercentage']
      }, () => {
        showCandidateProfileAvailable = true;
      });
    }).catch((xhr, status, error) => {
      showCandidateProfileAvailable = true;
      catchError(xhr, status, error);
    });
  } else {
    notification({
      icon: 'exclamation-circle',
      type: 'warning',
      title: 'Chargement du profil déjà en cours, veuillez patienter quelques instants.'
    })
  }
};

let showCandidateApplications = userId => {
  if (showCandidateApplicationsAvailable) {
    showCandidateApplicationsAvailable = false;
    $.post(`/api/es/${esId}/get/candidate/${userId}/applications`, { _csrf } , data => {
      createModal({
        id: 'viewCandidateApplicationsModal',
        modal: 'es/viewCandidateApplications',
        size: 'modal-xl',
        style: 'width:80%',
        title: `Les candidatures de ${data.User.firstName} ${data.User.lastName} dans votre établissement`,
        data,
      }, () => {
        showCandidateApplicationsAvailable = true;
      });
    }).catch((xhr, status, error) => {
      showCandidateApplicationsAvailable = true;
      catchError(xhr, status, error);
    });
  } else {
    notification({
      icon: 'exclamation-circle',
      type: 'warning',
      title: 'Chargement des candidatures déjà en cours, veuillez patienter quelques instants.'
    })
  }
};