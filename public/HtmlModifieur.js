


document.getElementById("Center-Creation").style.display = "none";

let show = false;
function change(){
    if(show === false){
        document.getElementById("Center-Connexion").style.display = "none";
        document.getElementById("Center-Creation").style.display = "block";
        show = true;
    }else{
        document.getElementById("Center-Creation").style.display = "none";
        document.getElementById("Center-Connexion").style.display = "block";
        show = false;
    }
}