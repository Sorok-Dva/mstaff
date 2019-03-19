'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let posts = [
      { name: 'Cadre responsable de secteurs de soins et d\'activités paramédicales', categoriesPS_id: 3 },
      { name: 'Aide soignant - ASD', categoriesPS_id: 3 },
      { name: 'Auxiliaire de Puériculture', categoriesPS_id: 3 },
      { name: 'Infirmier Puériculteur', categoriesPS_id: 3 },
      { name: 'Cadre responsable de secteurs de soins et d\'activités paramédicales chargé de missions transversales', categoriesPS_id: 3 },
      { name: 'Sage Femme', categoriesPS_id: 3 },
      { name: 'Cancérologue', categoriesPS_id: 2 },
      { name: 'Assistant de régulation médicale', categoriesPS_id: 4 },
      { name: 'Ergothérapeute', categoriesPS_id: 3 },
      { name: 'Nutritionniste', categoriesPS_id: 3 },
      { name: 'Masseur-kinésithérapeute', categoriesPS_id: 3 },
      { name: 'Psychomotricien', categoriesPS_id: 3 },
      { name: 'Cadre socio-éducatif', categoriesPS_id: 3 },
      { name: 'Radiophysicien en radiothérapie', categoriesPS_id: 3 },
      { name: 'Diététicien', categoriesPS_id: 3 },
      { name: 'Infirmier de Bloc Opératoire Diplômé d\'État -IBODE', categoriesPS_id: 3 },
      { name: 'Infirmier Anesthésiste Diplômé d\'Etat - IADE', categoriesPS_id: 3 },
      { name: 'Accueil-Standardiste', categoriesPS_id: 4 },
      { name: 'Acheteur', categoriesPS_id: 4 },
      { name: 'Addictologue', categoriesPS_id: 2 },
      { name: 'Adjoint au chef de service', categoriesPS_id: 3 },
      { name: 'Agent de soins', categoriesPS_id: 4 },
      { name: 'Agent des services logistiques', categoriesPS_id: 4 },
      { name: 'Agent d\'accueil', categoriesPS_id: 4 },
      { name: 'Agent de biberonnerie', categoriesPS_id: 4 },
      { name: 'Agent de bio-nettoyage', categoriesPS_id: 4 },
      { name: 'Agent de gestion administrative', categoriesPS_id: 4 },
      { name: 'Agent de maintenance générale des bâtiments', categoriesPS_id: 4 },
      { name: 'Agent de restauration et/ou d\'hôtellerie', categoriesPS_id: 4 },
      { name: 'Agent de service mortuaire', categoriesPS_id: 3 },
      { name: 'Agent de stérilisation', categoriesPS_id: 3 },
      { name: 'Agent en secteur médico-technique', categoriesPS_id: 3 },
      { name: 'Agent petite enfance', categoriesPS_id: 3 },
      { name: 'Aide médico-psychologique', categoriesPS_id: 3 },
      { name: 'Allergologue', categoriesPS_id: 2 },
      { name: 'Ambulancier', categoriesPS_id: 3 },
      { name: 'Anatomopathologiste', categoriesPS_id: 2 },
      { name: 'Andrologue', categoriesPS_id: 2 },
      { name: 'Anesthésiste / Réanimateur', categoriesPS_id: 2 },
      { name: 'Angiologue', categoriesPS_id: 2 },
      { name: 'Animateur socio - éducatif', categoriesPS_id: 3 },
      { name: 'Architecte/Urbaniste du SI', categoriesPS_id: 4 },
      { name: 'Archiviste', categoriesPS_id: 4 },
      { name: 'Agent des services hospitaliers', categoriesPS_id: 4 },
      { name: 'Assistant des services économiques', categoriesPS_id: 4 },
      { name: 'Assistant de communication', categoriesPS_id: 4 },
      { name: 'Assistant de recherche clinique', categoriesPS_id: 3 },
      { name: 'Assistant social des personnels', categoriesPS_id: 4 },
      { name: 'Assistant social des usagers', categoriesPS_id: 4 },
      { name: 'Assistant(e) administrative', categoriesPS_id: 4 },
      { name: 'Assistant(e) qualité', categoriesPS_id: 4 },
      { name: 'Assistant(e) de direction', categoriesPS_id: 4 },
      { name: 'Assistant(e) social(e)', categoriesPS_id: 3 },
      { name: 'Attaché(e) de recherche clinique (ARC)', categoriesPS_id: 4 },
      { name: 'Attaché(e) de direction', categoriesPS_id: 4 },
      { name: 'Automaticien de maintenance', categoriesPS_id: 4 },
      { name: 'Auxiliaire de puériculture en crèche', categoriesPS_id: 3 },
      { name: 'Auxiliaire socio-éducatif-sportif', categoriesPS_id: 4 },
      { name: 'Brancardier', categoriesPS_id: 3 },
      { name: 'Cadre administratif', categoriesPS_id: 4 },
      { name: 'Cadre de l\'enseignement de santé', categoriesPS_id: 3 },
      { name: 'Cadre de santé', categoriesPS_id: 3 },
      { name: 'Cadre Infirmier', categoriesPS_id: 3 },
      { name: 'Cadre administratif de pôle', categoriesPS_id: 4 },
      { name: 'Cadre d\'unité de soins et d\'activités paramédicales', categoriesPS_id: 3 },
      { name: 'Cadre d\'unité de soins et d\'activités paramédicales chargé de missions transversales', categoriesPS_id: 3 },
      { name: 'Cadre paramédical de pôle', categoriesPS_id: 3 },
      { name: 'Cardiologue', categoriesPS_id: 2 },
      { name: 'Chargé de rendez vous en santé', categoriesPS_id: 4 },
      { name: 'Chargé de valorisation de la recherche', categoriesPS_id: 4 },
      { name: 'Chargé des applications informatiques', categoriesPS_id: 4 },
      { name: 'Chargé des relations sociales', categoriesPS_id: 4 },
      { name: 'Chargé du développement des ressources humaines', categoriesPS_id: 4 },
      { name: 'Chargé(e) de mission', categoriesPS_id: 4 },
      { name: 'Chef de bloc', categoriesPS_id: 3 },
      { name: 'Chef de bureau', categoriesPS_id: 4 },
      { name: 'Chef de service administratif', categoriesPS_id: 4 },
      { name: 'Chef de projet informatique', categoriesPS_id: 4 },
      { name: 'Chirurgien de la face et du cou', categoriesPS_id: 2 },
      { name: 'Chirurgien en orthopédie et traumatologie', categoriesPS_id: 2 },
      { name: 'Chirurgien général', categoriesPS_id: 2 },
      { name: 'Chirurgien infantile', categoriesPS_id: 2 },
      { name: 'Chirurgien maxillo-facial et stomatologie', categoriesPS_id: 2 },
      { name: 'Chirurgien plastique, reconstructrice, esthétique', categoriesPS_id: 2 },
      { name: 'Chirurgien thoracique et cardio-vasculaire', categoriesPS_id: 2 },
      { name: 'Chirurgien urologue', categoriesPS_id: 2 },
      { name: 'Infirmier Diplômé d\'Etat - IDE', categoriesPS_id: 3 },
      { name: 'Chirurgien vasculaire', categoriesPS_id: 2 },
      { name: 'Chirurgien viscéral', categoriesPS_id: 2 },
      { name: 'Comptable', categoriesPS_id: 4 },
      { name: 'Conducteur de travaux tous corps d\'état', categoriesPS_id: 4 },
      { name: 'Conducteur d\'opérations tous corps d\'état', categoriesPS_id: 4 },
      { name: 'Conseiller en économie sociale et familiale', categoriesPS_id: 4 },
      { name: 'Conseiller en organisation', categoriesPS_id: 4 },
      { name: 'Conseiller hôtelier', categoriesPS_id: 4 },
      { name: 'Contrôleur de gestion', categoriesPS_id: 4 },
      { name: 'Coordinateur de parcours en santé', categoriesPS_id: 4 },
      { name: 'Coordinateur qualité/gestion des risques', categoriesPS_id: 4 },
      { name: 'Cuisinier-commis de cuisine', categoriesPS_id: 4 },
      { name: 'Dermatologue', categoriesPS_id: 2 },
      { name: 'Directeur Etablissement', categoriesPS_id: 4 },
      { name: 'Directeur Etablissement adjoint', categoriesPS_id: 4 },
      { name: 'Directeur des soins infirmiers', categoriesPS_id: 3 },
      { name: 'Directeur de site - projets', categoriesPS_id: 4 },
      { name: 'Directeur des investissements et de la maintenance', categoriesPS_id: 4 },
      { name: 'Directeur des ressources humaines', categoriesPS_id: 4 },
      { name: 'Directeur des services économiques', categoriesPS_id: 4 },
      { name: 'Directeur administratif et financier', categoriesPS_id: 4 },
      { name: 'Directeur des systèmes d\'information et de l\'organisation', categoriesPS_id: 4 },
      { name: 'Directeur comptable', categoriesPS_id: 4 },
      { name: 'Directeur des services juridiques', categoriesPS_id: 4 },
      { name: 'Éducateur spécialisé', categoriesPS_id: 3 },
      { name: 'Électricien / Électromécanicien', categoriesPS_id: 4 },
      { name: 'Encadrant Accueil - Standard', categoriesPS_id: 4 },
      { name: 'Encadrant archives', categoriesPS_id: 4 },
      { name: 'Encadrant de la sécurité des personnes et des biens', categoriesPS_id: 4 },
      { name: 'Encadrant gestion des ressources humaines', categoriesPS_id: 4 },
      { name: 'Encadrant installations et maintenance équipements sanitaires et thermiques', categoriesPS_id: 4 },
      { name: 'Encadrant logistique', categoriesPS_id: 4 },
      { name: 'Encadrant maintenance corps d\'état secondaires', categoriesPS_id: 4 },
      { name: 'Encadrant poste de travail / Support', categoriesPS_id: 4 },
      { name: 'Encadrant production culinaire / alimentaire', categoriesPS_id: 4 },
      { name: 'Encadrant réseau / Télécom', categoriesPS_id: 4 },
      { name: 'Encadrant sécurité incendie', categoriesPS_id: 4 },
      { name: 'Encadrant socio éducatif', categoriesPS_id: 4 },
      { name: 'Encadrant transport', categoriesPS_id: 4 },
      { name: 'Endocrinologue', categoriesPS_id: 2 },
      { name: 'Enseignant spécialisé', categoriesPS_id: 4 },
      { name: 'Enseignant d\'activité physique et sportive', categoriesPS_id: 4 },
      { name: 'Expert en produits de santé', categoriesPS_id: 3 },
      { name: 'Facturier(ère)', categoriesPS_id: 4 },
      { name: 'Formateur IFSI', categoriesPS_id: 4 },
      { name: 'Formateur des professionnels de santé - mission formation initiale', categoriesPS_id: 4 },
      { name: 'Gastro-entérologue', categoriesPS_id: 2 },
      { name: 'Gériatre', categoriesPS_id: 2 },
      { name: 'Gestionnaire économe', categoriesPS_id: 4 },
      { name: 'Gestionnaire accidents du travail / maladie professionnelle', categoriesPS_id: 4 },
      { name: 'Gestionnaire administratif', categoriesPS_id: 4 },
      { name: 'Gestionnaire admissions frais de séjour traitement externe', categoriesPS_id: 4 },
      { name: 'Gestionnaire comptable et achat', categoriesPS_id: 4 },
      { name: 'Gestionnaire de lits', categoriesPS_id: 4 },
      { name: 'Gestionnaire de stocks / Magasinier', categoriesPS_id: 4 },
      { name: 'Gestionnaire des achats', categoriesPS_id: 4 },
      { name: 'Gestionnaire des ressources humaines', categoriesPS_id: 4 },
      { name: 'Gestionnaire des retraites et des AT', categoriesPS_id: 4 },
      { name: 'Gestionnaire des travaux', categoriesPS_id: 4 },
      { name: 'Gestionnaire du temps de travail', categoriesPS_id: 4 },
      { name: 'Gestionnaire finances', categoriesPS_id: 4 },
      { name: 'Gestionnaire paie / carrière', categoriesPS_id: 4 },
      { name: 'Gestionnaire régie', categoriesPS_id: 4 },
      { name: 'Gestionnaire retraite', categoriesPS_id: 4 },
      { name: 'Gynécologue médical', categoriesPS_id: 2 },
      { name: 'Gynécologue obstétrique', categoriesPS_id: 2 },
      { name: 'Hématologue', categoriesPS_id: 2 },
      { name: 'Hygiéniste', categoriesPS_id: 3 },
      { name: 'Infectiologue', categoriesPS_id: 2 },
      { name: 'Infirmier en recherche clinique', categoriesPS_id: 3 },
      { name: 'Infirmière puéricultrice', categoriesPS_id: 3 },
      { name: 'Informaticien', categoriesPS_id: 4 },
      { name: 'Ingénieur biomédical', categoriesPS_id: 4 },
      { name: 'Ingénieur qualité', categoriesPS_id: 4 },
      { name: 'Ingénieur de recherche hospitalier', categoriesPS_id: 4 },
      { name: 'Intégrateur d\'applications', categoriesPS_id: 4 },
      { name: 'Interniste', categoriesPS_id: 2 },
      { name: 'Intervenant / support informatique utilisateurs', categoriesPS_id: 4 },
      { name: 'Intervenant informatique utilisateurs / Support applicatif', categoriesPS_id: 4 },
      { name: 'Juriste', categoriesPS_id: 4 },
      { name: 'Manipulateur en électro-radiologie médicale', categoriesPS_id: 3 },
      { name: 'Manipulateur en électro-radiologie médicale - Spécialiste en radioprotection', categoriesPS_id: 3 },
      { name: 'Médecin biologiste', categoriesPS_id: 2 },
      { name: 'Médecin chef de service', categoriesPS_id: 2 },
      { name: 'Médecin chef d\'établissement', categoriesPS_id: 2 },
      { name: 'Médecin conseil', categoriesPS_id: 2 },
      { name: 'Médecin coordonnateur', categoriesPS_id: 2 },
      { name: 'Médecin d\'aide sociale', categoriesPS_id: 2 },
      { name: 'Médecin de collecte', categoriesPS_id: 2 },
      { name: 'Médecin de la douleur', categoriesPS_id: 2 },
      { name: 'Médecin de PMI', categoriesPS_id: 2 },
      { name: 'Médecin de réanimation médicale', categoriesPS_id: 2 },
      { name: 'Médecin de santé publique et médecine sociale', categoriesPS_id: 2 },
      { name: 'Médecin DIM', categoriesPS_id: 2 },
      { name: 'Médecin du département de l\'information médicale (DIM)', categoriesPS_id: 2 },
      { name: 'Médecin du sport', categoriesPS_id: 2 },
      { name: 'Médecin du travail', categoriesPS_id: 2 },
      { name: 'Médecin généraliste', categoriesPS_id: 2 },
      { name: 'Médecin hygiéniste', categoriesPS_id: 2 },
      { name: 'Médecin légiste', categoriesPS_id: 2 },
      { name: 'Médecin nucléaire', categoriesPS_id: 2 },
      { name: 'Médecin Pharmacologue', categoriesPS_id: 2 },
      { name: 'Médecin rééducateur', categoriesPS_id: 2 },
      { name: 'Médecin salarié', categoriesPS_id: 2 },
      { name: 'Médecin scolaire', categoriesPS_id: 2 },
      { name: 'Médecin urgentiste', categoriesPS_id: 2 },
      { name: 'Médecin du travail', categoriesPS_id: 2 },
      { name: 'Menuisier - agenceur', categoriesPS_id: 4 },
      { name: 'Métallier - serrurier', categoriesPS_id: 4 },
      { name: 'Moniteur d\'atelier', categoriesPS_id: 4 },
      { name: 'Moniteur - Educateur', categoriesPS_id: 4 },
      { name: 'Monteur en installations et maintenance des installations sanitaires et thermiques', categoriesPS_id: 4 },
      { name: 'Néonatologue', categoriesPS_id: 2 },
      { name: 'Néphrologue', categoriesPS_id: 2 },
      { name: 'Neurochirurgien', categoriesPS_id: 2 },
      { name: 'Neurologue', categoriesPS_id: 2 },
      { name: 'Nutritionniste', categoriesPS_id: 2 },
      { name: 'Oncologue', categoriesPS_id: 2 },
      { name: 'Ophtalmologue', categoriesPS_id: 2 },
      { name: 'Orthophoniste', categoriesPS_id: 3 },
      { name: 'Orthoptiste', categoriesPS_id: 3 },
      { name: 'Ouvrier des services logistiques', categoriesPS_id: 4 },
      { name: 'Panseuse', categoriesPS_id: 3 },
      { name: 'Pédiatre', categoriesPS_id: 2 },
      { name: 'Pédicure podologue', categoriesPS_id: 3 },
      { name: 'Pédopsychiatre', categoriesPS_id: 2 },
      { name: 'Pharmacien', categoriesPS_id: 2 },
      { name: 'Plombier', categoriesPS_id: 4 },
      { name: 'Pneumologue', categoriesPS_id: 2 },
      { name: 'Préparateur en pharmacie', categoriesPS_id: 3 },
      { name: 'Préparateur en pharmacie - chef de groupe', categoriesPS_id: 3 },
      { name: 'Programmiste', categoriesPS_id: 4 },
      { name: 'Psychiatre', categoriesPS_id: 2 },
      { name: 'Psychologue', categoriesPS_id: 3 },
      { name: 'Psychomotricien', categoriesPS_id: 3 },
      { name: 'Radiologue', categoriesPS_id: 2 },
      { name: 'Rédacteur', categoriesPS_id: 4 },
      { name: 'Responsable administratif', categoriesPS_id: 4 },
      { name: 'Responsable assurance qualité', categoriesPS_id: 4 },
      { name: 'Responsable d\'accueil de communication', categoriesPS_id: 4 },
      { name: 'Responsable du secrétariat médical', categoriesPS_id: 4 },
      { name: 'Responsable informatique et télécom', categoriesPS_id: 4 },
      { name: 'Responsable logistique', categoriesPS_id: 4 },
      { name: 'Responsable maintenance sécurité', categoriesPS_id: 4 },
      { name: 'Responsable médico-technique', categoriesPS_id: 3 },
      { name: 'Responsable rééducateur', categoriesPS_id: 3 },
      { name: 'Responsable admissions / frais de séjour / traitement externe', categoriesPS_id: 4 },
      { name: 'Responsable archives', categoriesPS_id: 4 },
      { name: 'Responsable blanchisserie', categoriesPS_id: 4 },
      { name: 'Responsable budgétaire et financier', categoriesPS_id: 4 },
      { name: 'Responsable de crèche', categoriesPS_id: 3 },
      { name: 'Responsable de gestion administrative', categoriesPS_id: 4 },
      { name: 'Responsable de la maintenance tous corps d\'état', categoriesPS_id: 4 },
      { name: 'Responsable des marchés publics', categoriesPS_id: 4 },
      { name: 'Responsable des ressources humaines médicales', categoriesPS_id: 4 },
      { name: 'Responsable des services techniques', categoriesPS_id: 4 },
      { name: 'Responsable restauration', categoriesPS_id: 4 },
      { name: 'Responsable socio éducatif', categoriesPS_id: 4 },
      { name: 'Rhumatologue', categoriesPS_id: 2 },
      { name: 'Secrétaire médical', categoriesPS_id: 4 },
      { name: 'Secrétaire de Direction', categoriesPS_id: 4 },
      { name: 'Stomatologue', categoriesPS_id: 2 },
      { name: 'Surveillante', categoriesPS_id: 3 },
      { name: 'Technicien biomédical', categoriesPS_id: 3 },
      { name: 'Technicien de laboratoire médical', categoriesPS_id: 3 },
      { name: 'Technicien de maintenance des équipements biomédicaux', categoriesPS_id: 3 },
      { name: 'Technicien d\'études cliniques', categoriesPS_id: 3 },
      { name: 'Technicien réseau / Télécom', categoriesPS_id: 4 },
      { name: 'Thermicien / chauffagiste', categoriesPS_id: 4 },
      { name: 'Technicien d\'information médicale (TIM)', categoriesPS_id: 4 },
      { name: 'Pharmacien remplaçant d\'officine', categoriesPS_id: 2 },
      { name: 'Pharmacien hospitalier', categoriesPS_id: 2 },
      { name: 'Agent de service hospitalier - ASH - ASQH', categoriesPS_id: 3 },
      { name: 'Technicien de laboratoire biologie et biochimie', categoriesPS_id: 4 },
      { name: 'Frigoriste / climatien(ne)', categoriesPS_id: 4 },
      { name: 'Epidémiologiste responsable du réseau toxico-vigilance', categoriesPS_id: 4 },
      { name: 'Data Manager / Statisticien(ne)', categoriesPS_id: 4 },
      { name: 'Maître(sse) de Maison', categoriesPS_id: 4 },
      { name: 'AVJiste / Avéjiste', categoriesPS_id: 3 },
      { name: 'Éducateur Scolaire Spécialisé', categoriesPS_id: 3 },
      { name: 'Chauffeur ambulancier', categoriesPS_id: 4 },
      { name: 'Animatrice et agent d’office', categoriesPS_id: 3 },
      { name: 'Educateur de Jeunes Enfants', categoriesPS_id: 3 },
      { name: 'Directeur adjoint de crèche', categoriesPS_id: 4 },
      { name: 'Directeur de crèche', categoriesPS_id: 4 },
      { name: 'manutentionnaire pharmaceutique', categoriesPS_id: 4 },
      { name: 'Sophrologue', categoriesPS_id: 3 },
      { name: 'Naturopathe', categoriesPS_id: 3 },
      { name: 'Chiropracteur', categoriesPS_id: 3 },
      { name: 'Osthéopathe', categoriesPS_id: 3 },
      { name: 'Conseiller Médical', categoriesPS_id: 2 },
      { name: 'Responsable qualité / gestion des risques', categoriesPS_id: 3 },
      { name: 'Assistant / assistante dentaire', categoriesPS_id: 3 },
      { name: 'Dentiste', categoriesPS_id: 2 },
      { name: 'Chirurgien dentiste', categoriesPS_id: 2 },
      { name: 'Orthodontiste', categoriesPS_id: 2 },
      { name: 'Prothésiste dentaire', categoriesPS_id: 3 },
      { name: 'Secrétaire dentaire', categoriesPS_id: 4 },
      { name: 'Ouvrier polyvalent', categoriesPS_id: 4 },
      { name: 'Manipulateur en radiologie - MER - radiothérapie', categoriesPS_id: 3 },
      { name: 'Socio-esthéticienne', categoriesPS_id: 3 },
      { name: 'Assistant de vie aux familles (ADVF) - Auxiliaire de vie sociale (AVS)', categoriesPS_id: 3 },
      { name: 'Infirmier Diplômé d\'Etat Libéral (IDEL)', categoriesPS_id: 3 },
      { name: 'Cadre de rééducation', categoriesPS_id: 3 },
      { name: 'Neuropsychologue', categoriesPS_id: 3 },
      { name: 'Art-thérapeute', categoriesPS_id: 3 },
      { name: 'Enseignant Activité Physique Adapté (APA)', categoriesPS_id: 3 },
      { name: 'Cadre logistique', categoriesPS_id: 4 },
      { name: 'Gouvernante', categoriesPS_id: 4 },
      { name: 'Serveur (euse)', categoriesPS_id: 4 },
      { name: 'Second de cuisine', categoriesPS_id: 4 },
      { name: 'Plongeur', categoriesPS_id: 4 },
      { name: 'Linger(e)', categoriesPS_id: 4 },
      { name: 'Chirurgien Oto-rhino-laryngologie (ORL)', categoriesPS_id: 2 },
      { name: 'Intervenant / Formateur spécialisé santé sur les fonctions supports', categoriesPS_id: 4 },
      { name: 'Chargé(e) des applications informatiques', categoriesPS_id: 4 },
      { name: 'Chef(fe) de projet informatique', categoriesPS_id: 4 },
      { name: 'Architecte / Urbaniste du SI', categoriesPS_id: 4 },
      { name: 'Expert(e) technique (réseau, système, BDD,...)', categoriesPS_id: 4 },
      { name: 'Responsable sécurité des systèmes d\'information (RSSI)', categoriesPS_id: 4 },
      { name: 'Exploitant(e) technique (réseau, système, BDD, téléphonie, visio)', categoriesPS_id: 4 },
      { name: 'Intervenant(e) / Support Informatique utilisateurs', categoriesPS_id: 4 },
      { name: 'Mandataire Judiciaire à la Protection des Majeurs (MJPM)', categoriesPS_id: 4 },
      { name: 'Infirmier-stomathérapeute', categoriesPS_id: 3 },
      { name: 'Infirmier en pratique avancée (IPA)', categoriesPS_id: 3 },
      { name: 'Ergonome', categoriesPS_id: 2 }
    ];
    let records = [];

    posts.forEach((post) => {
      records.push(post);
    });

    return queryInterface.bulkInsert('Posts', records, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Posts', null, {});
  }
};
