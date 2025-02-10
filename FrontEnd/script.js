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

  /**
   *
   * Générer dynamiquement les boutons de catégorie
   * Sélection / traitement /insertion
   *
   * - Interroger l'API✅
   * - Parvenir à créer un tableau ✅
   * - Boucler sur le tableau pour ✅
   * - Créer nos éléments html pour ✅
   * - Insérer dans le DOM ✅
   *
   * Parvenir à connecter ces boutons à notre système de filtrage ✅
   *
   */
  async function getCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories");
    const categories = await reponse.json();

    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.setAttribute("data-categoryId", "0");

    //Selectionner la div boutons
    const buttonsContainer = document.querySelector(".boutons");
    buttonsContainer.appendChild(allButton);

    // Créer les boutons
    categories.forEach((category) => {
      const button = document.createElement("button");

      // Ajout du texte et de l'attribut data-categorieId
      button.textContent = category.name;
      button.setAttribute("data-categoryId", category.id);
      buttonsContainer.appendChild(button);
    });

    // Ajouter un événement de clic au bouton
    const buttons = document.querySelectorAll(".boutons button");
    buttons.forEach((button) => {
      button.addEventListener("click", function (event) {
        const categoryId_String =
          event.currentTarget.getAttribute("data-categoryId");
        const categoryId_Number = parseInt(categoryId_String);

        fetchProjects(categoryId_Number);
      });
    });
  }

  getCategories();
  //Activer/Désactiver le mode Edition--------------------------------------------

  //Selection de la barre Edition et des boutons modifs
  const editModeBar = document.getElementById("edit-mode-bar");
  const editButtons = document.querySelectorAll(".edit-button");
  //verif du token dans le localStorage
  const token = localStorage.getItem("token");
  if (editModeBar) {
    //verif de l'element sur la page
    if (token) {
      console.log("Mode edition connecté, affichage des boutons");
      editModeBar.style.display = "inline";
      editButtons.forEach((button) => {
        button.style.display = "inline"; //OU block?
      });
    } else {
      console.log("Non connecté!! Pas de boutons!");
      //s'assurer que les boutons soient masqués
      editModeBar.style.display = "none";
      editButtons.forEach((button) => {
        button.style.display = "none";
      });
    }
  }
  //Gérer la deconnection
  const logOutButton = document.getElementById("logout");
  logOutButton.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("Déconnection de l'utilisateur");
    localStorage.removeItem("token"); //supprime le token
    window.location.reload(); //Recharge la page
  });

  //La modale-------------------------------la modale

  const modale = document.getElementById("modal");
  const editButton = document.getElementById("edit-button");
  const closeModal = document.getElementById("close-modal");
  const thumbnailGallery = document.getElementById("thumbnail-gallery");
  //const addImageButton = document.getElementById("add-image-button");

  //ouvrir la modale
  editButton.addEventListener("click", (event) => {
    // selectionner la modal
    //changer son style pour l'afficher
    modale.style.display = "block";
    loadThumbnails(); //charge les miniatures
    console.log("modale ouverte! avec bouton modifier");
  });
  //fermer la modale avecle bouton de fermeture
  closeModal.addEventListener("click", () => {
    modale.style.display = "none";
  });
  //fermer la modale en cliquant ailleurs
  window.addEventListener("click", (event) => {
    if (event.target === modale) {
      modale.style.display = "none";
    }
  });
  // Comment on affiche nos photos à l'intérieur ?
  /**
   * Récupérer l'élément #gallery et son contenu -> il va falloir le manipuler et le traiter pour afficher les bonnes infos 2/3h
   * - Ne pas commencer à gérer la suppresion des éléments -
   * Ajouter le bouton "Ajouter une photo" 30min
   * Au clic sur le bouton d'ajout de photo -> modifier le contenu de la modal avec un formulaire
   *
   * ---
   * Parvenir à fermer la modal FACILE SOLO
   * Parvenir à récupérer les données du formulaire MOYEN
   * Envoyer à l'API DIFFICILE
   */
  //Pour charger les miniatures----fonction dédiée----------
  async function fetchProjectsThumbnails() {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des projets pour les miniatures :",
        error
      );
      return [];
    }
  }

  function loadThumbnails() {
    fetchProjectsThumbnails().then((projects) => {
      thumbnailGallery.innerHTML = ""; // Vider le conteneur des miniatures
      projects.forEach((project) => {
        const img = document.createElement("img");
        img.src = project.imageUrl;
        img.alt = project.title;
        img.dataset.projectId = project.id;
        //Ajout d'un évenement de suppression pour chaque miniature
        img.addEventListener("click", () => {
          if (confirm("Voulez-vous supprimer cette image ?")) {
            // Utiliser project.id pour la suppression
            deleteProject(project.id).then(() => {
              loadThumbnails(); // Recharger les miniatures après la suppression
            });
          }
        });
        thumbnailGallery.appendChild(img);
      });
      // Ajouter le bouton "Ajouter une photo" à la fin de la galerie
      const addPhotoButton = document.createElement("button");
      addPhotoButton.textContent = "Ajouter une photo";
      addPhotoButton.id = "add-image-button";
      addPhotoButton.style.marginTop = "20px"; // Pour espacer le bouton
      addPhotoButton.addEventListener("click", () => {
        console.log("Bouton 'Ajouter une photo' cliqué !");
        showAddPhotoForm(); // Appeler la fonction pour afficher
      });

      thumbnailGallery.appendChild(addPhotoButton);
    });
  }
  // Fonction pour afficher le formulaire d'ajout de photo
  function showAddPhotoForm() {
    // Vider le contenu actuel de la modale
    thumbnailGallery.innerHTML = "";

    // Créer le formulaire
    const form = document.createElement("form");
    form.id = "add-photo-form";

    // Ajouter un champ pour le titre de la photo
    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Titre :";
    titleLabel.setAttribute("for", "photo-title");
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "photo-title";
    titleInput.name = "title";
    titleInput.required = true;

    // Ajouter un champ pour télécharger une image
    const imageLabel = document.createElement("label");
    imageLabel.textContent = "Télécharger une image :";
    imageLabel.setAttribute("for", "photo-file");
    const imageInput = document.createElement("input");
    imageInput.type = "file";
    imageInput.id = "photo-file";
    imageInput.name = "file";
    imageInput.accept = "image/*";
    imageInput.required = true;

    // Ajouter un bouton pour soumettre le formulaire
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Ajouter la photo";

    // Ajouter un bouton pour annuler et revenir aux miniatures
    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.textContent = "Annuler";
    cancelButton.style.marginLeft = "10px";
    cancelButton.addEventListener("click", () => {
      loadThumbnails(); // Revenir aux miniatures
    });

    // Ajouter les éléments au formulaire
    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(imageLabel);
    form.appendChild(imageInput);
    form.appendChild(submitButton);
    form.appendChild(cancelButton);

    // Ajouter le formulaire à la modale
    thumbnailGallery.appendChild(form);

    // Gestion de l'envoi du formulaire
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); // Empêcher le rechargement de la page

      // Récupérer les données du formulaire
      const formData = new FormData();
      formData.append("title", titleInput.value);
      formData.append("file", imageInput.files[0]);

      try {
        // Envoyer une requête POST à l'API
        const response = await fetch(apiUrl, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }

        console.log("Photo ajoutée avec succès !");
        loadThumbnails(); // Recharger les miniatures
      } catch (error) {
        console.error("Erreur lors de l'ajout de la photo :", error);
      }
    });
  }
  // ESSAIS de : AJOUTER PHOTO
  const addPhotoModal = document.getElementById("add-photo-modal");
  const backToThumbnailsButton = document.getElementById("back-to-thumbnails");
  const closeAddPhotoModalButton = document.getElementById(
    "close-add-photo-modal"
  );
  const addPhotoButton = document.getElementById("add-image-button");
  const photoUploadInput = document.getElementById("photo-upload");
  const photoPreview = document.getElementById("photo-preview");
  const photoCategorySelect = document.getElementById("photo-category");
  const addPhotoForm = document.getElementById("add-photo-form");

  // Vérification que le bouton "add-image-button" existe dans le DOM
  if (addPhotoButton) {
    // Ouvrir le formulaire d'ajout de photo
    addPhotoButton.addEventListener("click", () => {
      addPhotoModal.style.display = "block";
    });
  } else {
    console.error(
      "Le bouton avec l'ID 'add-image-button' est introuvable dans le DOM."
    );
  }
});
