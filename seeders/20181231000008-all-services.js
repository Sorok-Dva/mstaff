'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let services = [
      'Anesthésiologie', 'Andrologie', 'Angiologie', 'Hygiène', 'Radiothérapie', 'Unité cognitivo comportementale',
      'Bloc opératoire', 'Immunologie et allergologie clinique', 'Cardiologie', 'Chimiothérapie Ambulatoire',
      'Hépato-Gastro-Entérologie', 'Chirurgie génèrale', 'Médecine nucléaire', 'Endoncrinologie,diabétologie,métabolisme et nutrition',
      'Endoscopie', 'Gériatrie', 'Gérontologie', 'Gynécologie-obstétrique', 'Hématologie', 'Imuno-Rhumatologie',
      'Néonatologie', 'Néphrologie', 'Neurologie', 'Odontologie (dentisterie)', 'Oncologie-cancérologie', 'Ophtalmologie',
      'Oto-rhino-laryngologie (ORL) et chirurgie cervico-faciale', 'Pédiatrie générale', 'Pneumologie', 'Psychiatrie (PSY)',
      'Psychiatrie de l\'enfant et de l\'adolescent (pédopsychiatrie)', 'Réanimation', 'Réeducation fonctionelle',
      'Rhumatologie', 'Soins intensifs', 'Urgences', 'Urologie', 'Addictologie', 'Maternité', 'Surveillance continue',
      'Salle de surveillance Post-interventionnelle', 'Accueil medical', 'Traitement de la douleur', 'Chirurgie ambulatoire',
      'Orthopédie et traumatologie', 'Vasculaire', 'Digestif', 'Médecine générale (polyvalente)', 'Soins palliatifs et médecine de la douleur',
      'Dermatologie', 'Stomatologie', 'Esthétique', 'Hémodialyse', 'Diététique', 'Services généraux', 'Autres',
      'Services Libéraux', 'Tous services', 'Soins de suite et de Réadaptation (SSR)', 'Soins infectieux et maladies tropicales',
      'Transplantation rénale', 'Soins généraux'
    ];
    let records = [];

    services.forEach((service) => {
      records.push({
        name: service
      });
    });

    return queryInterface.bulkInsert('Services', records, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Services', null, {});
  }
};
