'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let services = [
      { name: 'Anesthésiologie', categoriesPS_id: 2 },
      { name: 'Andrologie', categoriesPS_id: 2 },
      { name: 'Angiologie', categoriesPS_id: 2 },
      { name: 'Hygiène', categoriesPS_id: 3 },
      { name: 'Radiothérapie', categoriesPS_id: 2 },
      { name: 'Unité cognitivo comportementale', categoriesPS_id: 2 },
      { name: 'Bloc opératoire', categoriesPS_id: 2 },
      { name: 'Immunologie et allergologie clinique', categoriesPS_id: 2 },
      { name: 'Cardiologie', categoriesPS_id: 2 },
      { name: 'Chimiothérapie Ambulatoire', categoriesPS_id: 2 },
      { name: 'Hépato-Gastro-Entérologie', categoriesPS_id: 2 },
      { name: 'Chirurgie génèrale', categoriesPS_id: 2 },
      { name: 'Médecine nucléaire', categoriesPS_id: 2 },
      { name: 'Endocrinologie, diabétologie, métabolisme et nutrition', categoriesPS_id: 2 },
      { name: 'Endoscopie', categoriesPS_id: 2 },
      { name: 'Gériatrie', categoriesPS_id: 2 },
      { name: 'Gérontologie', categoriesPS_id: 2 },
      { name: 'Gynécologie-obstétrique', categoriesPS_id: 2 },
      { name: 'Hématologie', categoriesPS_id: 2 },
      { name: 'Imuno-Rhumatologie', categoriesPS_id: 2 },
      { name: 'Néonatologie', categoriesPS_id: 2 },
      { name: 'Néphrologie', categoriesPS_id: 2 },
      { name: 'Neurologie', categoriesPS_id: 2 },
      { name: 'Odontologie (dentisterie)', categoriesPS_id: 2 },
      { name: 'Oncologie-cancérologie', categoriesPS_id: 2 },
      { name: 'Ophtalmologie', categoriesPS_id: 2 },
      { name: 'Oto-rhino-laryngologie (ORL) et chirurgie cervico-faciale', categoriesPS_id: 2 },
      { name: 'Pédiatrie générale', categoriesPS_id: 2 },
      { name: 'Pneumologie', categoriesPS_id: 2 },
      { name: 'Psychiatrie (PSY)', categoriesPS_id: 2 },
      { name: 'Psychiatrie de l\'enfant et de l\'adolescent (pédopsychiatrie)', categoriesPS_id: 2 },
      { name: 'Réanimation', categoriesPS_id: 2 },
      { name: 'Réeducation fonctionelle', categoriesPS_id: 2 },
      { name: 'Rhumatologie', categoriesPS_id: 2 },
      { name: 'Soins intensifs', categoriesPS_id: 2 },
      { name: 'Urgences', categoriesPS_id: 2 },
      { name: 'Urologie', categoriesPS_id: 2 },
      { name: 'Addictologie', categoriesPS_id: 2 },
      { name: 'Maternité', categoriesPS_id: 2 },
      { name: 'Surveillance continue', categoriesPS_id: 2 },
      { name: 'Salle de surveillance Post-interventionnelle', categoriesPS_id: 2 },
      { name: 'Accueil medical', categoriesPS_id: 2 },
      { name: 'Traitement de la douleur', categoriesPS_id: 2 },
      { name: 'Chirurgie ambulatoire', categoriesPS_id: 2 },
      { name: 'Orthopédie et traumatologie', categoriesPS_id: 2 },
      { name: 'Vasculaire', categoriesPS_id: 2 },
      { name: 'Digestif', categoriesPS_id: 2 },
      { name: 'Médecine générale (polyvalente)', categoriesPS_id: 2 },
      { name: 'Soins palliatifs et médecine de la douleur', categoriesPS_id: 2 },
      { name: 'Dermatologie', categoriesPS_id: 2 },
      { name: 'Stomatologie', categoriesPS_id: 2 },
      { name: 'Esthétique', categoriesPS_id: 2 },
      { name: 'Hémodialyse', categoriesPS_id: 2 },
      { name: 'Diététique', categoriesPS_id: 2 },
      { name: 'Services généraux', categoriesPS_id: 4 },
      { name: 'Services Libéraux', categoriesPS_id: 5 },
      { name: 'Soins de suite et de Réadaptation (SSR)', categoriesPS_id: 2 },
      { name: 'Soins infectieux et maladies tropicales', categoriesPS_id: 2 },
      { name: 'Transplantation rénale', categoriesPS_id: 2 },
      { name: 'Soins généraux', categoriesPS_id: 2 },
      { name: 'Réanimation pédiatrique', categoriesPS_id: 2 },
      { name: 'Nurserie', categoriesPS_id: 2 },
      { name: 'Néonatologie - unité de Soins Intensifs', categoriesPS_id: 2 },
      { name: 'Soins intensifs pédiatriques', categoriesPS_id: 2 },
      { name: 'Radiologie conventionnelle', categoriesPS_id: 2 },
      { name: 'Kinésithérapie', categoriesPS_id: 2 }
    ];
    let records = [];

    services.forEach((service) => {
      records.push(service);
    });

    return queryInterface.bulkInsert('Services', records, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Services', null, {});
  }
};