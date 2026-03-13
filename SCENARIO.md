# SCENARIO DU PROJET - FASOHABITAT

## 1. Description du projet
**Fasohabitat** est une plateforme immobilière complète conçue pour faciliter la mise en relation entre propriétaires (vendeurs ou bailleurs) et acheteurs/locataires. Le projet permet de lister des biens immobiliers, de les rechercher via des critères précis, de gérer des favoris et de communiquer directement via une messagerie intégrée.

## 2. Architecture générale
Le projet repose sur une architecture moderne découplée en trois entités principales :

*   **Backend (API Rest) :** Construit avec **Node.js** et **Express**, utilisant **MongoDB** (via Mongoose) comme base de données NoSQL. La sécurité est assurée par JWT et Helmet.
*   **Web Frontend :** Application **Next.js** (React) en TypeScript, offrant une expérience fluide et optimisée pour le SEO.
*   **Mobile App :** Application cross-platform développée avec **Flutter** (Dart), permettant une utilisation mobile native.

## 3. Acteurs du système
*   **Acheteur / Locataire (Buyer) :** Recherche des biens, les ajoute en favoris, contacte les propriétaires.
*   **Propriétaire (Owner) :** Publie ses annonces, fournit les justificatifs de propriété, gère ses messages.
*   **Administrateur (Admin) :** Supervise la plateforme, gère les signalements (reports), modère les annonces et les utilisateurs, consulte les statistiques globales.

## 4. Fonctionnalités principales
*   **Gestion des Comptes :** Inscription, connexion (JWT), support OAuth (Google/Social) et gestion de profil.
*   **Gestion des Annonces (CRUD) :**
    *   Publication de biens avec photos, caractéristiques détaillées (chambres, salles de bain, surface, équipements) et localisation précise.
    *   Téléchargement de documents officiels (CNI, Titre foncier/Bail) pour vérification.
*   **Recherche et Recherche :** Filtres avancés par ville, type de transaction (Vente/Location), type de bien, prix maximum et équipements spécifiques.
*   **Système de Favoris :** Sauvegarde des annonces intéressantes pour consultation ultérieure.
*   **Messagerie Interne :** Chat avec notifications en temps réel pour les messages non lus (badge visuel dans la barre de navigation).
*   **Supervision Admin :** Tableaux de bord, gestion des signalements de fraude, blocage d'annonces et suppression d'utilisateurs.

## 5. Flux de fonctionnement
1.  **Parcours Utilisateur (Acheteur) :**
    *   Visite de la page d'accueil -> Recherche de biens -> Consultation du détail -> Ajout aux favoris ou envoi d'un message au propriétaire.
2.  **Parcours Propriétaire :**
    *   Création de compte -> Accès à l'interface "Publier" -> Remplissage des détails du bien + Upload des justificatifs -> Publication de l'annonce.
3.  **Parcours de Modération :**
    *   Signalement d'une annonce par un utilisateur -> L'admin reçoit une notification de "Report" -> Analyse de l'annonce -> Blocage de l'annonce ou rejet du signalement.

## 6. Logique métier
*   **Validation des Biens :** Bien que le statut par défaut soit "approved", le système prévoit un flux de validation où les documents (ID card, deed) servent de base à la confiance.
*   **Sécurité des Données :** Seul le propriétaire ou un administrateur peut modifier/supprimer une annonce.
*   **Visibilité :** Les annonces "rejectées" ou "bloquées" ne sont pas visibles par le public mais restent accessibles au propriétaire et à l'admin pour historique.
*   **Isolation :** Les messages sont liés à une propriété spécifique pour garder le contexte de la discussion.

## 7. Interaction Frontend / Backend
*   **Communication :** Les frontends (Web et Mobile) consomment l'API REST via des appels HTTP.
*   **Authentification :** Le backend délivre un Token JWT lors de la connexion, stocké sur le client et envoyé dans les headers pour chaque requête protégée.
*   **Multimédia :** Les images et documents sont envoyés via Multipart/form-data, stockés sur le serveur dans un dossier `/uploads` et servis de manière statique.

## 8. Structure des dossiers
*   `/backend` : Contient l'API, les modèles Mongoose, les contrôleurs de logique et les routes Express.
*   `/web` : Application Next.js avec une structure basée sur le App Router (`src/app`), les composants réutilisables et les contextes de gestion d'état.
*   `/mobile` : Projet Flutter structuré en `screens` (écrans), `models` (données), `providers` (gestion d'état) et `services` (appels API).

## 9. Scénarios d’utilisation
### Scénario A : La quête d'un logement
Un étudiant cherche un appartement à Ouagadougou. Il utilise l'application mobile pour filtrer par ville et type "Location". Il trouve un studio, consulte les photos et la surface. Convaincu, il clique sur "Contacter" pour envoyer un message au propriétaire afin de demander une visite.

### Scénario B : La vente sécurisée
Un propriétaire souhaite vendre sa villa. Il se connecte sur la plateforme web, remplit le formulaire de publication, télécharge son titre foncier pour prouver l'authenticité de son offre et publie. Il reçoit plus tard des notifications de messages de potentiels acheteurs.

### Scénario C : La modération proactive
Un utilisateur remarque une annonce suspecte (prix trop bas, photos louches) et la signale. L'administrateur, via son interface de supervision, examine le dossier, constate l'absence de documents valides et bloque l'annonce pour protéger les autres utilisateurs.
