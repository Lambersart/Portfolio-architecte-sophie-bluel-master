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
  const addImageButton = document.getElementById("add-image-button");
  //Récup du h2
  const galleryTitle = document.getElementById("gallery-title");

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
  // --- Fonction pour supprimer un projet ---
  async function deleteProject(imageId) {
    try {
      // const token = localStorage.getItem("authToken");
      console.log("token récupéré:", token);

      const response = await fetch(
        `http://localhost:5678/api/works/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(
          `Erreur lors de la suppression du projet (statut ${response.status})`
        );
      }
      console.log(`Projet ${imageId} supprimé avec succès`);
      //Erreur: syntaxe:JSON.parse
      // return await response.json();
      //supprimer du DOM
      const imageElement = document.querySelector(
        `[data-project-id="${imageId}"]`
      );
      if (imageElement) {
        imageElement.parentElement.remove(); // Supprime le conteneur de l'image
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du projet :", error);
    }
  }

  //--Ajout Charger les miniatures
  function loadThumbnails() {
    fetchProjectsThumbnails().then((projects) => {
      thumbnailGallery.innerHTML = ""; // Vider le conteneur des miniatures
      projects.forEach((project) => {
        const container = document.createElement("div");
        container.classList.add("thumbnail-container");

        const img = document.createElement("img");
        img.src = project.imageUrl;
        img.alt = project.title;
        img.dataset.projectId = project.id;

        // Création de l'icône de suppression
        const trashIcon = document.createElement("i");
        trashIcon.classList.add("fa-solid", "fa-trash", "trash-icon");

        // Ajout de l'événement de suppression
        trashIcon.addEventListener("click", (event) => {
          event.stopPropagation(); // Empêche l'event de se propager à l'image
          if (confirm(`Voulez-vous supprimer l'image "${project.title}" ?`)) {
            deleteProject(project.id).then(() => {
              loadThumbnails(); // Recharger les miniatures après suppression
            });
          }
        });

        container.appendChild(img);
        container.appendChild(trashIcon);
        thumbnailGallery.appendChild(container);
      });
    });
  }

  // Fonction pour afficher le formulaire d'ajout de photo avec bouton HTML
  function showAddPhotoForm() {
    // galleryTitle.style.opacity = "0";
    // addImageButton.style.opacity = "0";
    //masque le titre et le formulaire

    galleryTitle.style.display = "none";
    addImageButton.style.display = "none";
    thumbnailGallery.innerHTML = `
      <div id="add-photo-form">
        <button id="back-button" class="back-button">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
       <h2>Ajout photo</h2>
        <form id="photo-form">
          <div class="form-group upload-box">
            <label for="photo-upload" class="upload-label">
              <i class="fa-solid fa-image"></i>
            
              <p>jpg, png : 4mo max</p>
            </label>
            <input type="file" id="photo-upload" class="photo-input" accept="image/png, image/jpeg" required />
          </div>
          <div class="form-group">
            <label for="photo-title">Titre</label>
            <input type="text" id="photo-title" class="form-input" placeholder="Titre de la photo" required />
          </div>
          <div class="form-group">
            <label for="photo-category">Catégorie</label>
            <select id="photo-category" class="form-input" required>
              <option value="">Sélectionnez une catégorie</option>
              <option value="1">Objets</option>
              <option value="2">Appartements</option>
              <option value="3">Hotels et restaurants</option>
            </select>
          </div>
          <button type="submit" class="submit-button">Valider</button>
        </form>
      </div>
    `;

    // Gestion du bouton retour
    document.getElementById("back-button").addEventListener("click", () => {
      // titre et h2
      galleryTitle.style.display = "block";
      addImageButton.style.display = "block";
      loadThumbnails(); // Recharger les miniatures
    });

    // Gestion du formulaire
    document
      .getElementById("photo-form")
      .addEventListener("submit", (event) => {
        event.preventDefault(); // Empêche le rechargement de la page

        // Récupère les données du formulaire
        const formData = new FormData();
        const photoInput = document.getElementById("photo-upload");
        const titleInput = document.getElementById("photo-title");
        const categoryInput = document.getElementById("photo-category");

        formData.append("image", photoInput.files[0]);
        formData.append("title", titleInput.value);
        formData.append("category", categoryInput.value);

        // Envoie les données à l'API (ajoute ton URL et gère les erreurs)
        //  const token =
        //    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczOTM3MTIyNywiZXhwIjoxNzM5NDU3NjI3fQ.-53NSROjP_yrG58sHI480G-BeD0T_wLj2Tp3UbYgIUo"; // Remplace par ton vrai token
        console.log("token récupéreé!");

        fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Ajout du token
          },
          body: formData,
        })
          .then((response) => {
            if (response.ok) {
              alert("Photo ajoutée avec succès !");
              loadThumbnails(); // Recharge la galerie
            } else {
              console.log(response);
              throw new Error("Erreur lors de l'ajout de la photo.");
            }
          })
          .catch((error) => console.error(error));
      });
  }
  // Attacher l'événement au bouton "Ajouter une photo" du HTML
  if (addImageButton) {
    addImageButton.addEventListener("click", () => {
      console.log("Bouton 'Ajouter une photo' cliqué !");
      showAddPhotoForm();
    });
  }
});
