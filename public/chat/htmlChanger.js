// Récuperer l'username
const params = window.location.pathname.split("/");
const username = params[2];

document.getElementById("WelcomeText").innerHTML = "Bienvenue " + username;
document.getElementById("Username").value = username;

document.getElementById("user-container").style.display = "none";

let show = false;
function change(){
    if(show === false){
        document.getElementById("user-container").style.display = "block";
        show = true;
    }else{
        document.getElementById("user-container").style.display = "none";
        show = false;
    }
}