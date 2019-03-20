'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let formations = [
      "Diplome d'état d'aide soignant (DEAS)", "Diplome d'état d'auxiliaire de puericulture (DEAP)",
      "Diplome d'état d'infirmier anesthesiste (DEIA)", "Diplome d'état de puériculture (DEP)", "Diplome d'état de sage femme", "Diplome d'état de psychomotricien",
      "Diplome d'état d'ergotherapeute", 'Brevet professionnel (BP) de preparateur en pharmacie', 'Diplôme Qualifiant en Physique Radiologique Médical (DQPRM)',
      'BEP/CAP', 'Employé/Opérateur/Ouvrier Spécialisé/Bac', 'Technicien/Employé Bac +2', 'Agent de maîtrise/Bac +3/4', 'Ingénieur/Cadre/Bac +5', 'Cadre dirigeant',
      'Cadre de Santé Diplômé', 'Cadre Supérieur de Santé Diplômé', 'Directeur de Soins Diplômé', "Diplôme d'état de docteur en chirurgie dentaire", "Diplôme d'état ambulancier",
      "Diplôme d'Etat de docteur en médecine (DES)", 'D.E.S.C D’ADDICTOLOGIE', 'D. E. S.C. D’ALLERGOLOGIE ET D’IMMUNOLOGIE CLINIQUE', 'D. E. S. C. D’ANDROLOGIE', 'D. E. S. C. D’HEMOBIOLOGIE-TRANSFUSION',
      'D. E. S. C. D’ORTHOPEDIE DENTO-MAXILLO-FACIALE', 'D. E. S. C. DE CANCEROLOGIE', 'D. E. S. C. DE DERMOPATHOLOGIE', 'D. E. S. C. DE FOETOPATHOLOGIE', 'D. E. S. C. DE MEDECINE D’URGENCE',
      'D. E. S. C. DE MEDECINE DE LA REPRODUCTION', 'D. E. S. C. DE MEDECINE DU SPORT', 'D. E. S. C. DE MEDECINE LEGALE ET EXPERTISES MEDICALES', 'D. E. S. C. DE MEDECINE VASCULAIRE',
      'D. E. S. C. DE NEONATOLOGIE', 'D. E. S. C. DE NEUROPATHOLOGIE', 'D. E. S. C. DE NUTRITION', 'D. E. S. C. DE PATHOLOGIE INFECTIEUSE ET TROPICALE, CLINIQUE ET BIOLOGIQUE',
      'D. E. S. C. DE PHARMACOLOGIE CLINIQUE ET EVALUATION DES THERAPEUTIQUES', 'D. E. S. C. DE PSYCHIATRIE DE L’ENFANT ET DE L’ADOLESCENT', 'D. E. S. C .DE CHIRURGIE VASCULAIRE',
      'D. E. S. C. DE CHIRURGIE DE LA FACE ET DU COU', 'D. E. S. C. DE CHIRURGIE INFANTILE', 'D. E. S. C. DE CHIRURGIE MAXILLO-FACIALE ET STOMATOLOGIE',
      'D. E. S. C. DE CHIRURGIE ORTHOPEDIQUE ET TRAUMATOLOGIE', 'D. E. S. C. DE CHIRURGIE PLASTIQUE RECONSTRUCTRICE ET ESTHETIQUE', 'D. E. S. C. DE CHIRURGIE THORACIQUE ET CARDIO-VASCULAIRE',
      'D. E. S. C. DE CHIRURGIE UROLOGIQUE', 'D. E. S. C. DE CHIRURGIE VISCERALE ET DIGESTIVE', 'D. E. S. C. DE GERIATRIE', 'D. E. S. C. DE REANIMATION MEDICALE', 'Diplôme d’État de docteur en pharmacie',
      'D.E.S Pharmacie', 'Brevet professionnel préparateur en pharmacie', 'Diplôme d’État de technicien de laboratoire médical (DETLM)', "Diplôme Universitaire (DU) de Technicien de l'Information Médicale",
      'DU hygiène et prévention du risque infectieux nosocomial et qualité des soins', 'BTS prothésiste dentaire', "Diplome d'état d'infirmier (DEI)"
    ];
    let records = [];

    formations.forEach((formation) => {
      records.push({
        name: formation
      });
    });

    return queryInterface.bulkInsert('Formations', records, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Formations', null, {});
  }
};
