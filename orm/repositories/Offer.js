module.exports.getSectionLabels = () => {
  return {
    nature_section: {
      label: 'Nature de l\'offre',
      entries: {
        post: 'Poste',
        contract_type: 'Type de contrat',
        start: 'Date de début',
        end: 'Date de fin',
        jobSheet: 'Fiche métier',
        contractDuration: 'Durée du contrat',
        grade: 'Grade',
        category: 'Catégorie'
      }
    },
    context_section: {
      label: 'Contexte de travail',
      entries: {
        website: 'Site',
        attach: 'Rattachement de l\'établissement',
        pole: 'Pôle',
        presentation: 'Présentation de l\'établissement'
      }
    },
    details_section: {
      label: 'Détails de l\'offre',
      entries: {
        schedule: 'Horaires',
        roll: 'Roulement',
        quota: 'Quotité',
        strain: 'Gardes ou astreintes',
        access: 'Accès',
        housing: 'Logement',
        remuneration: 'Rémunération',
        risk: 'Risques professionnels et préventifs'
      }
    },
    postDescription_section: {
      label: 'Description du poste',
      entries: {
        presentation: 'Présentation du poste',
        team: 'Composition de l\'équipe',
        uphill: 'Rattachement hiérarchique amont',
        backing: 'Rattachement hiérarchique aval',
        external: 'Relations fonctionnelles externes à l\'établissement',
        internal: 'Relations fonctionnelles internes à l\'établissement',
        internService: 'Relations fonctionnelles internes au service'
      }
    },
    prerequisites_section: {
      label: 'Prérequis',
      entries: {
        diploma: 'Diplôme',
        skill: 'Compétences',
        knowledge: 'Connaissances'
      }
    },
    terms_sections: {
      label: 'Modalités de candidature',
      entries: {
        recruit: 'Responsable du recrutement',
        mail: 'Mail de contact',
        contractual: 'Ouvert aux contractuels',
        military: 'Ouvert aux militaires'
      }
    }
  };
};