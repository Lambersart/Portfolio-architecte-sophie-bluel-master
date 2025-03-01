document.addEventListener("DOMContentLoaded", () => {
  // détecter le clic sur le bouton d'envoi du formulaire et récupérer les infos

  // 1 - sélectionner l'élément du formulaire
  const boutonEnvoi = document.querySelector(".submit");

  const errorMessage = document.querySelector("#error-message");

  // 2- Ajouter le listener
  boutonEnvoi.addEventListener("click", function (event) {
    event.preventDefault();
    console.log("btn Cliqué!,connection..");

    // 3 - Récupérer les informations entrées par l'utilisateur
    const emailFromForm = document.querySelector("#email").value.trim();
    const passwordFromForm = document.querySelector("#password").value.trim();

    //  FUSIBLE
    let fuse = true;
    if (emailFromForm.length < 1) {
      fuse = false;
    }
    if (passwordFromForm.length < 6) {
      // Vérification de la longueur du mot de passe
      fuse = false;
    }
    if (!validateEmail(emailFromForm)) {
      fuse = false;
    }

    // Si une erreur est détectée, on bloque l'appel à l'API et on affiche un message d'erreur
    if (!fuse) {
      errorMessage.innerText = "Email ou mot de passe invalide.";
      errorMessage.style.display = "block";
      setTimeout(() => {
        errorMessage.innerText = "";
      }, 5000);
      return; // Empêche l'appel à l'API
    }

    // Si les champs sont corrects, on cache le message d'erreur
    errorMessage.style.display = "none";

    // 4 - On construit le corps de la requête
    const requestBody = {
      email: emailFromForm,
      password: passwordFromForm,
    };
    // console.log("Email saisi:", emailFromForm);
    // console.log("mot de passe saisi!", passwordFromForm);
    // console.log("corps de la requète!!:", requestBody);

    // 6 - On envoie notre body dans la fonction de connection
    getLogIn(requestBody);
  });
  //fonction pour gérer la connexion
  // Fonction pour valider le format de l'email
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  async function getLogIn(requestBody) {
    try {
      console.log("envoi de la requete à l'API");

      const reponse = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("réponse reçu de l'API:", reponse);
      if (!reponse.ok) {
        throw new Error("Identifiants incorrects");
      }
      //verifier si la réponse est bien un JSON
      let data;
      try {
        data = await reponse.json();
        // console.log("données reçues de l'API", data);
      } catch (jsonError) {
        throw new Error("La réponse de l'API n'est pas un JSON valide");
      }

      //Le token dans localStorage
      console.log("Stockage du token dans localStorage");
      localStorage.setItem("token", data.token);
      console.log("connection réussie redirection vers la page d'accueil..");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Erreur de connexion:", error);
      errorMessage.textContent = "email ou mot de passe incorrect";
      errorMessage.style.display = "block";
    }
  }
});
