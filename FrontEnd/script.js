document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const apiUrl = "http://localhost:5678/api/works";

  // Faire en sorte de charger dynamiquement les boutons de catégorie
  /** Il faut récupérer les catégories à partir de l'API, boucler dessus et créer les boutons pour les
   * injecter dans le HTML
   */

  /**
   * Ensuite avancer sur la page login tuto à suivre : https://openclassrooms.com/fr/courses/7697016-creez-des-pages-web-dynamiques-avec-javascript/7911191-sauvegardez-les-donnees-grace-a-une-api-http
   */

  // Définir l'URL de l'API
  /**  Fonction pour récupérer et afficher les projets depuis l'API
	ID de la catégorie à filtrer (0 = toutes les catégories) */
  async function fetchProjects(idCategorie = 0) {
    try {
      // Afficher un message pendant le chargement
      gallery.innerHTML = "<p>Chargement des projets...</p>";

      // Envoyer une requête GET à l'API
      const response = await fetch(apiUrl);

      // Vérifier si la réponse est valide
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      // Convertir les données JSON en objet JavaScript
      const data = await response.json();

      // Vider la galerie avant d'afficher les nouveaux projets
      gallery.innerHTML = "";

      // Vérifier si des projets sont disponibles
      if (data.length === 0) {
        gallery.innerHTML = "<p>Aucun projet trouvé.</p>";
        return;
      }

      // Parcourir les projets et les afficher
      data.forEach((project) => {
        // Filtrer par catégorie si nécessaire
        /** Si la idCatégorie est égale à 0 alors on continue en traitant chaque projet contenu dans data 
				OU idCategorie est différent de 0 et est égale à l'id de la catégorie du "project" intérrogé et on continue ou non */
        if (idCategorie === 0 || idCategorie === project.category.id) {
          // Créer un élément figure pour chaque projet
          const figure = document.createElement("figure");

          // Ajouter l'image
          const img = document.createElement("img");
          img.src = project.imageUrl; // URL de l'image
          img.alt = project.title || "Projet"; // Texte alternatif
          figure.appendChild(img);

          // Ajouter le titre en tant que légende
          const figcaption = document.createElement("figcaption");
          figcaption.textContent = project.title || "Sans titre";
          figure.appendChild(figcaption);

          // Ajouter la figure dans la galerie
          gallery.appendChild(figure);
        }
      });
    } catch (error) {
      // Gérer les erreurs et afficher un message à l'utilisateur
      console.error("Erreur :", error);
      gallery.innerHTML = "<p>Erreur lors du chargement des projets.</p>";
    }
  }
  // Appeler la fonction au démarrage pour afficher tous les projets
  fetchProjects();
  //--------------Essais du dimanche---------------------------------
  // définir les catégories
  /* const categories = [
    { id: 1, name: "Tous" },
    { id: 2, name: "Objets" },
    { id: 3, name: "Hotels et restaurants" },
  ];
  //Selectionner la div boutons
  const buttonsContainer = document.querySelector(".boutons");
  // Créer les boutons
  categories.forEach((category) => {
    const button = document.createElement("button");
    // Ajout du texte et de l'attribut data-categorieId
    button.textContent = category.name;
    button.setAttribute("data-categoryId", category.id);
  });*/
  // Ajouter un événement de clic au bouton
  const buttons = document.querySelectorAll(".boutons button");

  buttons.forEach((button) => {
    button.addEventListener("click", function (event) {
      const categoryId_String =
        event.currentTarget.getAttribute("data-categoryId");
      const categoryId_Number = parseInt(categoryId_String);

      fetchProjects(categoryId_Number);
    });
    // ajout du bouton
    /*
    buttonsContainer.appendChild(button);
    console.log(button);
  });
  // 1. Définir les catégories (par exemple un tableau d'objets)
  const categories = [
    { id: 1, name: "Catégorie 1" },
    { id: 2, name: "Catégorie 2" },
    { id: 3, name: "Catégorie 3" },
  ];

  // 2. Sélectionner le conteneur des boutons
  const buttonsContainer = document.querySelector(".boutons");

  // 3. Créer et ajouter les boutons dynamiquement
  categories.forEach((category) => {
    // Créer un bouton
    const button = document.createElement("button");

    // Ajouter un texte et un attribut data-categoryId
    button.textContent = category.name;
    button.setAttribute("data-categoryId", category.id);

    // Ajouter un événement de clic au bouton
    button.addEventListener("click", function (event) {
      const categoryId_String =
        event.currentTarget.getAttribute("data-categoryId");
      const categoryId_Number = parseInt(categoryId_String);

      // Appeler la fonction avec l'ID
      fetchProjects(categoryId_Number);
    });

    // Ajouter le bouton au conteneur
    buttonsContainer.appendChild(button);
  });

  // 4. Exemple de la fonction fetchProjects
  function fetchProjects(categoryId) {
    console.log(`Chargement des projets pour la catégorie : ${categoryId}`);
    // Logique de récupération des projets ici
  }*/
    //_________Dernier Essai---------------------------------------------------------------------
  });
});
const boutonTous = "tous";
//console.log(boutonTous);
const btn1 = document.createElement("button");
//console.log(btn1);
btn1.innerText = boutonTous;
const body = document.querySelector(".boutons");
body.appendChild(btn1);
