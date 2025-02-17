/**
 * Ici on va avoir pour objectif de détecter le clic sur le bouton
 * -> récupérer les données qui ont été saisies par l'utilisateur
 * -> formattage nécessaire ???
 * -> envoyer au backend/api avec un fetch avec la méthode POST
 * -> traiter la réponse du backend et on enchaine sur la suite
 * http://localhost:5678/api/users/login
 */
document.addEventListener("DOMContentLoaded", () => {
  // détecter le clic sur le bouton d'envoi du formulaire et récupérer les infos

  // 1 - sélectionner l'élément du formulaire
  const boutonEnvoi = document.querySelector(".submit");

  const errorMessage = document.querySelector("#error-message");
  //Vérification
  console.log("envoi:", boutonEnvoi);
  //console.log("Erreur", errorMessage);

  // 2- Ajouter le listener
  boutonEnvoi.addEventListener("click", function (event) {
    event.preventDefault();
    console.log("btn Cliqué!,connection..");

    // 3 - Récupérer les informations entrées par l'utilisateur
    const emailFromForm = document.querySelector("#email").value;
    const passwordFromForm = document.querySelector("#password").value;

    // 4 - On construit le corps de la requête
    const requestBody = {
      email: emailFromForm,
      password: passwordFromForm,
    };
    console.log("Email saisi:", passwordFromForm);
    console.log("mot de passe saisi!", passwordFromForm);
    console.log("corps de la requète!!:", requestBody);

    // 6 - On envoie notre body dans la fonction de connection
    getLogIn(requestBody);
  });
  //fonction pour gérer la connexion
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
      //verifier si la réponse est bien un JSON
      let data;
      try {
        data = await reponse.json();
        console.log("données reçues de l'API", data);
      } catch (jsonError) {
        throw new Error("La réponse de l'API n'est pas un JSON valide");
      }
      if (!reponse.ok) {
        console.error("erreur détectée:", data);
        //data.message, sinon stringify de l'objet data
        let errorMsg =
          data.message || JSON.stringify(data) || "échec de la connection";
        throw new Error(errorMsg);
      }
      //Le token dans localStorage
      console.log("Stockage du token dans localStorage");
      localStorage.setItem("token", data.token);
      console.log("connection réussie redirection vers la page d'accueil..");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Erreur de connexion:", error);
      errorMessage.textContent = error.message;
      errorMessage.style.display = "block";
    }
  }
});
