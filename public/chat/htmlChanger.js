// Récuperer l'username
const params = window.location.pathname.split("/");
const username = params[2];

document.getElementById("WelcomeText").innerHTML = "Bienvenue " + username;
document.getElementById("Username").value = username;