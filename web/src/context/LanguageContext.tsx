"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Navbar
    nav_buy: "Acheter",
    nav_rent: "Louer",
    nav_about: "À propos",
    nav_login: "Se connecter",
    nav_register: "S'inscrire",
    nav_logout: "Déconnexion",

    // Home Page
    home_hero_badge: "Immobilier d'Exception",
    home_hero_title1: "L'immobilier de ",
    home_hero_title2: "Référence",
    home_hero_title3: "Au Burkina Faso.",
    home_hero_desc: "Découvrez une sélection exclusive de propriétés prestigieuses au cœur du Burkina Faso. Plus qu'une maison, une signature de vie à votre image.",
    home_btn_explore: "Explorer la Collection",
    home_btn_explore_hover: "C'est parti",
    home_btn_publish: "Publier une Annonce",

    // Search Page
    search_hero_badge: "Exploration du Patrimoine",
    search_hero_title: "Vivez l'immobilier",
    search_hero_rare: "rare et exclusif.",
    search_placeholder_city: "Ville (Ouaga, Bobo...)",
    search_type_transaction: "Transaction",
    search_type_buy: "Acheter",
    search_type_rent: "Louer",
    search_property_type: "Type de Bien",
    search_property_villa: "Villa",
    search_property_apartment: "Appartement",
    search_property_land: "Terrain",
    search_property_office: "Bureau",
    search_property_conference: "Conférence",
    search_property_hotel: "Hôtel",
    search_placeholder_price: "Prix Max",
    search_button: "Chercher",
    search_results_prefix: "Affichage de",
    search_results_suffix: "Propriétés au Burkina",
    search_no_results: "Aucun bien ne correspond à votre recherche",
    search_reset: "Réinitialiser la recherche",
    search_details: "Détails",

    // Property Details
    prop_back: "Retour à la Collection",
    prop_exclusive: "Exclusivité • Burkina Faso",
    prop_price_direct: "Prix Direct",
    prop_surface: "Surface",
    prop_config: "Configuration",
    prop_rooms: "Pièces",
    prop_area: "m²",
    prop_experience: "L'Expérience",
    prop_prestations: "Prestations Privées",
    prop_immersiv: "Galerie Immersive",
    prop_conciergerie: "Conciergerie Dédiée",
    prop_broker: "Courtier Certifié Burkina",
    prop_chat: "Discuter en Direct",
    prop_expert: "Contacter l'Expert",
    prop_report: "Signaler ce Bien",
    prop_report_reason: "Raison du signalement",
    prop_report_success: "Signalement envoyé avec succès",
    prop_delete: "Supprimer l'Annonce",
    prop_delete_confirm: "Voulez-vous vraiment supprimer cette annonce ?",
    prop_description: "Description de la Propriété",
    prop_features: "Caractéristiques & Équipements",
    prop_gallery: "Galerie Exclusive",
    prop_contact_title: "Prendre Rendez-vous",
    prop_contact_subtitle: "Entretien Confidentiel",
    prop_contact_name: "Nom Complet",
    prop_contact_email: "Email de Prestige",
    prop_contact_phone: "Ligne Directe",
    prop_contact_message: "Votre Message",
    prop_contact_button: "Envoyer ma Demande",
    prop_contact_whatsapp: "Contacter via WhatsApp",

    // Publish
    pub_new_coll: "Nouvelle Collection",
    pub_title: "Publier une Annonce",
    pub_subtitle: "Mettez votre bien d'exception en lumière au Burkina Faso",
    pub_nature: "Nature de l'Exclusivité",
    pub_nature_desc: "Choisissez le mode de mise à disposition de votre propriété sur le marché local.",
    pub_rent_label: "Location de Prestige",
    pub_sell_label: "Vente Exceptionnelle",
    pub_reg_info: "Registre des Informations",
    pub_label_title: "Titre de l'Annonce",
    pub_placeholder_title: "Ex: Résidence de Charme à Ouaga 2000",
    pub_label_price: "Prétention Financière",
    pub_placeholder_price: "Prix en FCFA",
    pub_label_surface: "Surface Totale",
    pub_placeholder_surface: "Ex: 450",
    pub_label_rooms: "Nombre de Pièces",
    pub_placeholder_rooms: "Ex: 5",
    pub_narrative: "Récit Privé du Bien",
    pub_narrative_placeholder: "Narration de l'élégance et de la distinction du lieu...",
    pub_geo: "Ancrage Géographique",
    pub_geo_desc: "Placez le marqueur sur la carte pour définir la géolocalisation exacte de votre propriété au Burkina.",
    pub_certify: "Certifier la Position",
    pub_map_init: "Initialisation des Coordonnées...",
    pub_postal: "Désignation Postale Précise",
    pub_postal_placeholder: "Ex: Patte d'Oie, Secteur 15, Ouagadougou",
    pub_trust: "Protocole de Confiance",
    pub_trust_desc: "Nous vérifions chaque annonce manuellement pour garantir l'exclusivité et la sécurité de notre patrimoine.",
    pub_expert_val: "Validation d'Expert sous 24h",
    pub_auth: "Authentification de Propriété",
    pub_id_card: "Pièce d'Identité",
    pub_mandate: "Mandat de Location",
    pub_title_deed: "Titre de Propriété",
    pub_photo_title: "Catalogues Photographiques (8K)",
    pub_photo_max: "Max 10 images",
    pub_photo_drop: "Déposer vos Chefs-d'œuvre",
    pub_photo_formats: "Format RAW, JPEG ou PNG supportés",
    pub_abandon: "Abandonner le Projet",
    pub_submit: "Transmettre pour Homologation",

    // Profile
    prof_welcome: "Bienvenue,",
    prof_status_owner: "Propriétaire Privilège",
    prof_status_member: "Membre Collection",
    prof_tab_listings: "Mes Annonces",
    prof_tab_favs: "Mes Favoris",
    prof_tab_msgs: "Messages",
    prof_tab_settings: "Paramètres",
    prof_logout: "Déconnexion",
    prof_patrimoine: "Mon Patrimoine",
    prof_patrimoine_desc: "Gestion de vos annonces exclusives",
    prof_inscrire: "Inscrire un Bien",
    prof_status_online: "En Ligne",
    prof_admin: "Administrer",
    prof_fav_empty: "Collection Vide",
    prof_fav_empty_desc: "Explorez nos résidences d'exception pour constituer votre propre collection privée.",
    prof_start_explore: "Démarrer l'Exploration",
    prof_conciergerie: "Conciergerie",
    prof_msgs_desc: "Vos échanges privilégiés",
    prof_msg_ago: "il y a",
    prof_settings_identity: "Identité",
    prof_settings_name: "Patronyme",
    prof_settings_email: "Adresse Email de Prestige",
    prof_settings_phone: "Ligne Directe",
    prof_settings_button: "Mettre à Jour le Profil",

    // Supervision
    sup_tab: "Supervision",
    sup_stats: "Statistiques",
    sup_users: "Utilisateurs",
    sup_reports: "Signalements",
    sup_total_users: "Total Utilisateurs",
    sup_total_properties: "Total Annonces",
    sup_total_reports: "Nouveaux Signalements",
    sup_block: "Bloquer",
    sup_delete_user: "Supprimer",
    sup_confirm_delete: "Confirmer la suppression ?",

    // About
    profile_welcome: "Bienvenue,",
    profile_status: "Membre Privilégié",
    profile_tab_listings: "Mes Collections",
    profile_tab_favs: "Mes Favoris",
    profile_tab_msgs: "Correspondances",
    profile_tab_settings: "Paramètres",
    profile_logout: "Déconnexion",
    profile_settings_title: "Préférences",
    profile_settings_subtitle: "Sécurisez et personnalisez votre accès",
    profile_settings_identity: "Identité",
    profile_settings_name: "Patronyme",
    profile_settings_email: "Adresse Email de Prestige",
    profile_settings_phone: "Ligne Directe",
    profile_settings_button: "Mettre à Jour le Profil",

    // About
    about_hero_badge: "Héritage & Prestige",
    about_hero_title: "L'Art de Vivre d'Exception",
    about_hero_subtitle: "Redéfinir les standards de l'immobilier de luxe depuis 2024",
    about_philosophy_badge: "Notre Philosophie",
    about_philosophy_title: "Fasohabitat est une promesse d'exclusivité absolue.",
    about_philosophy_desc: "Nous avons fondé cette collection avec une vision claire : créer une passerelle confidentielle entre les architectures les plus remarquables et une clientèle en quête d'excellence. Chaque bien est une œuvre, chaque transaction est un service de haute-couture immobilière.",
    about_feature_discretion: "Discrétion Souveraine",
    about_feature_discretion_desc: "Un anonymat et une protection totale pour vos actifs les plus précieux.",
    about_feature_rarity: "Rareté Certifiée",
    about_feature_rarity_desc: "Seuls les biens dotés d'une âme et d'un cachet unique intègrent notre sélection.",
    about_stats_items: "Biens d'Exception",
    about_stats_sales: "Ventes Réalisées",
    about_stats_clients: "Clients Satisfaits",
    about_stats_experts: "Experts Dédiés",
    about_engagement_badge: "Conciergerie & Expertise",
    about_engagement_title: "L'Excellence au Service du Burkina",
    about_engagement_v1_title: "Vision Globale",
    about_engagement_v1_desc: "Une analyse rigoureuse du marché pour anticiper les tendances de l'immobilier de haute-volée.",
    about_engagement_v2_title: "Haute-Couture",
    about_engagement_v2_desc: "Un accompagnement sur-mesure pour chaque étape de votre acquisition ou cession.",
    about_engagement_v3_title: "Ancrage Local",
    about_engagement_v3_desc: "Une connaissance intime des quartiers les plus prestigieux au Burkina Faso.",
  },
  en: {
    // Navbar
    nav_buy: "Buy",
    nav_rent: "Rent",
    nav_about: "About",
    nav_login: "Login",
    nav_register: "Sign Up",
    nav_logout: "Logout",

    // Home Page
    home_hero_badge: "Exceptional Real Estate",
    home_hero_title1: "Elegance",
    home_hero_title2: "meets",
    home_hero_title3: "comfort.",
    home_hero_desc: "Discover an exclusive selection of prestigious properties in the heart of Burkina Faso. More than a house, a life signature in your image.",
    home_btn_explore: "Explore the Collection",
    home_btn_explore_hover: "Let's go",
    home_btn_publish: "Publish an Ad",

    // Search Page
    search_hero_badge: "Heritage Exploration",
    search_hero_title: "Experience real estate",
    search_hero_rare: "rare and exclusive.",
    search_placeholder_city: "City (Ouaga, Bobo...)",
    search_type_transaction: "Transaction",
    search_type_buy: "Buy",
    search_type_rent: "Rent",
    search_property_type: "Property Type",
    search_property_villa: "Villa",
    search_property_apartment: "Apartment",
    search_property_land: "Land",
    search_property_office: "Office",
    search_property_conference: "Conference",
    search_property_hotel: "Hotel",
    search_placeholder_price: "Max Price",
    search_button: "Search",
    search_results_prefix: "Showing",
    search_results_suffix: "Properties in Burkina",
    search_no_results: "No property matches your search",
    search_reset: "Reset search",
    search_details: "Details",

    // Property Details
    prop_back: "Back to Collection",
    prop_exclusive: "Exclusivity • Burkina Faso",
    prop_price_direct: "Direct Price",
    prop_surface: "Surface",
    prop_config: "Configuration",
    prop_rooms: "Rooms",
    prop_area: "sqm",
    prop_experience: "The Experience",
    prop_prestations: "Private Services",
    prop_immersiv: "Immersive Gallery",
    prop_conciergerie: "Dedicated Concierge",
    prop_broker: "Burkina Certified Broker",
    prop_chat: "Direct Chat",
    prop_expert: "Contact Expert",
    prop_report: "Report Listing",
    prop_report_reason: "Reason for report",
    prop_report_success: "Report sent successfully",
    prop_delete: "Delete Listing",
    prop_delete_confirm: "Are you sure you want to delete this listing?",
    prop_description: "Property Description",
    prop_features: "Features & Amenities",
    prop_gallery: "Exclusive Gallery",
    prop_contact_title: "Make an Appointment",
    prop_contact_subtitle: "Confidential Interview",
    prop_contact_name: "Full Name",
    prop_contact_email: "Prestige Email",
    prop_contact_phone: "Direct Line",
    prop_contact_message: "Your Message",
    prop_contact_button: "Send My Request",
    prop_contact_whatsapp: "Contact via WhatsApp",

    // Publish
    pub_new_coll: "New Collection",
    pub_title: "Publish an Ad",
    pub_subtitle: "Put your exceptional property in the spotlight in Burkina Faso",
    pub_nature: "Exclusivity Nature",
    pub_nature_desc: "Choose the mode of making your property available on the local market.",
    pub_rent_label: "Prestige Rental",
    pub_sell_label: "Exceptional Sale",
    pub_reg_info: "Information Registry",
    pub_label_title: "Listing Title",
    pub_placeholder_title: "Ex: Charming Residence in Ouaga 2000",
    pub_label_price: "Financial Expectations",
    pub_placeholder_price: "Price in FCFA",
    pub_label_surface: "Total Surface",
    pub_placeholder_surface: "Ex: 450",
    pub_label_rooms: "Number of Rooms",
    pub_placeholder_rooms: "Ex: 5",
    pub_narrative: "Property's Private Tale",
    pub_narrative_placeholder: "Narration of the place's elegance and distinction...",
    pub_geo: "Geographical Anchor",
    pub_geo_desc: "Place the marker on the map to define the exact geolocation of your property in Burkina.",
    pub_certify: "Certify Position",
    pub_map_init: "Initializing Coordinates...",
    pub_postal: "Precise Postal Designation",
    pub_postal_placeholder: "Ex: Patte d'Oie, Sector 15, Ouagadougou",
    pub_trust: "Trust Protocol",
    pub_trust_desc: "We manually verify each ad to guarantee exclusivity and security of our heritage.",
    pub_expert_val: "Expert Validation within 24h",
    pub_auth: "Property Authentication",
    pub_id_card: "ID Document",
    pub_mandate: "Rental Mandate",
    pub_title_deed: "Title Deed",
    pub_photo_title: "Photographic Catalogs (8K)",
    pub_photo_max: "Max 10 images",
    pub_photo_drop: "Drop your Masterpieces",
    pub_photo_formats: "RAW, JPEG or PNG formats supported",
    pub_abandon: "Abandon Project",
    pub_submit: "Submit for Approval",

    // Profile
    prof_welcome: "Welcome,",
    prof_status_owner: "Privilege Owner",
    prof_status_member: "Collection Member",
    prof_tab_listings: "My Listings",
    prof_tab_favs: "My Favorites",
    prof_tab_msgs: "Messages",
    prof_tab_settings: "Settings",
    prof_logout: "Logout",
    prof_patrimoine: "My Heritage",
    prof_patrimoine_desc: "Manage your exclusive listings",
    prof_inscrire: "Register a Property",
    prof_status_online: "Online",
    prof_admin: "Administer",
    prof_fav_empty: "Empty Collection",
    prof_fav_empty_desc: "Explore our exceptional residences to build your own private collection.",
    prof_start_explore: "Start Exploration",
    prof_conciergerie: "Concierge",
    prof_msgs_desc: "Your privileged exchanges",
    prof_msg_ago: "ago",
    prof_settings_identity: "Identity",
    prof_settings_name: "Surname",
    prof_settings_email: "Prestige Email Address",
    prof_settings_phone: "Direct Line",
    prof_settings_button: "Update Profile",

    // Supervision
    sup_tab: "Supervision",
    sup_stats: "Statistics",
    sup_users: "Users",
    sup_reports: "Reports",
    sup_total_users: "Total Users",
    sup_total_properties: "Total Listings",
    sup_total_reports: "New Reports",
    sup_block: "Block",
    sup_delete_user: "Delete",
    sup_confirm_delete: "Confirm deletion?",

    // About
    profile_welcome: "Welcome,",
    profile_status: "Privileged Member",
    profile_tab_listings: "My Collections",
    profile_tab_favs: "My Favorites",
    profile_tab_msgs: "Correspondences",
    profile_tab_settings: "Settings",
    profile_logout: "Logout",
    profile_settings_title: "Preferences",
    profile_settings_subtitle: "Secure and personalize your access",
    profile_settings_identity: "Identity",
    profile_settings_name: "Surname",
    profile_settings_email: "Prestige Email Address",
    profile_settings_phone: "Direct Line",
    profile_settings_button: "Update Profile",

    // About
    about_hero_badge: "Heritage & Prestige",
    about_hero_title: "The Art of Exceptional Living",
    about_hero_subtitle: "Redefining luxury real estate standards since 2024",
    about_philosophy_badge: "Our Philosophy",
    about_philosophy_title: "Fasohabitat is a promise of absolute exclusivity.",
    about_philosophy_desc: "We founded this collection with a clear vision: to create a confidential bridge between the most remarkable architectures and a clientele seeking excellence. Each property is a work of art, each transaction is a high-fashion real estate service.",
    about_feature_discretion: "Sovereign Discretion",
    about_feature_discretion_desc: "Total anonymity and protection for your most precious assets.",
    about_feature_rarity: "Certified Rarity",
    about_feature_rarity_desc: "Only properties with a unique soul and character enter our selection.",
    about_stats_items: "Exceptional Properties",
    about_stats_sales: "Sales Completed",
    about_stats_clients: "Satisfied Clients",
    about_stats_experts: "Dedicated Experts",
    about_engagement_badge: "Concierge & Expertise",
    about_engagement_title: "Excellence Serving Burkina",
    about_engagement_v1_title: "Global Vision",
    about_engagement_v1_desc: "Rigorous market analysis to anticipate high-end real estate trends.",
    about_engagement_v2_title: "High-Fashion",
    about_engagement_v2_desc: "Tailor-made support for every stage of your acquisition or sale.",
    about_engagement_v3_title: "Local Rooting",
    about_engagement_v3_desc: "Intimate knowledge of the most prestigious neighborhoods in Burkina Faso.",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('fr');

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as Language;
    if (savedLang) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLang(savedLang);
    }
  }, []);

  const changeLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  const t = (key: string) => {
    return translations[lang][key as keyof typeof translations['fr']] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
