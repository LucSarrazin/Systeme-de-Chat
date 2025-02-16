<?php
session_start();
// Définit le fuseau horaire par défaut à utiliser.
date_default_timezone_set('UTC');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mydata";

// créé une connexion
$bdd = new mysqli($servername, $username, $password,$dbname);

// Vérifier connexion
if ($bdd->connect_error) {
  die("Connexion échouée : " . $bdd->connect_error);
}
$Onetime = false;

$sql = ("SELECT * FROM message ORDER BY Id DESC LIMIT 5");
$requete = $bdd->query($sql);
//$requete->execute();
//$stmt = $conn->query($sql);
//$resultat = $requete->fetch_all(MYSQLI_ASSOC);
/*$query = $conn->prepare("SELECT * FROM message ORDER BY Id DESC");
$query->execute();
$user = $query->fetchAll();*/

//$utilisateur = $resultat['Username'];
//$messageEnvoyer = $resultat['Message'];

//echo($_SESSION['Nom']);
$Username = $_SESSION['Nom'];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if(isset($_POST['Submit']) && !empty($_POST['message'])){
        $message = $_POST['message']; //get input text
        $DateTime = date("Y-m-d-H:i:s"); 
        /*
        $sql2 = ("SELECT * FROM message WHERE Username=$Username AND Message=$message");
        $requete2 = $bdd->query($sql2);
        if ($requete2->num_rows > 0) {
            echo "Ce message est déjà envoyé.";
        }*/

        //else{
            /*$sql = "INSERT INTO message (Username,Message,Date) VALUES ('$Username','$message','$DateTime')";

            if ($bdd->query($sql) === TRUE) {
              // echo "Nouvelle entrée créer avec succès !";
                header('Location: Index.php');
                exit;
            } 
            else {
                echo "Erreur: " . $sql . "<br>" . $bdd->error;
            }*/
            // Prepare the SQL statement
        $requete = $bdd->prepare("INSERT INTO message (Username, Message, Date) VALUES (?, ?, ?)");

        // Bind the parameters to the statement
        $requete->bind_param("sss", $Username, $message, $DateTime);

        // Execute the statement
        $requete->execute();
        
        header('Location: Index.php');
        exit;
 //       }
    }
}

?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="JavaScript.js"></script>
    <title>Page de chat</title>
</head>
<body>
    <h1>Bonjour <?php echo $_SESSION['Nom']?></h1>
    <form method="post" action="">
        <h4>Pseudo :</h4>
        <input type="text" placeholder="Username" disabled="true" id="Username" value="<?php echo $_SESSION['Nom']?>">
        <br>
        <h4>Entrez un message :</h4>
        <input type="text" id="message" name="message">
        <input type="Submit" name="Submit" id="Submit">
    </form>

    <script>
        document.getElementById("message").autofocus
        texte = document.getElementById("message");
        submit = document.getElementById("Submit");
        focus = false;
        TimeOut = setTimeout(() => {
            if (focus == false) {
                window.location.reload();
            }
        }, 3000);
        TimeOut2 = setTimeout(() => {
            if(focus == false){
                window.location.reload();
            }
        }, 3000);


        texte.addEventListener('focus', function() {
            clearTimeout(TimeOut);
            clearTimeout(TimeOut2);
            focus = true;
            console.log('focus');
        });

        texte.addEventListener('blur', function() {
            focus = false;
            console.log('not focus');
        });

        // Add a listener for the 'keydown Enter' event on the form
        texte.form.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                // Prevent the default form submission behavior
                event.preventDefault();
            }
        });

        submit.addEventListener('focus', function() {
            clearTimeout(TimeOut);
            clearTimeout(TimeOut2);
            focus = true;
            console.log('Submit focus');
        });
    </script>
<h3>
    <?php
    if ($requete->num_rows > 0) {
        // output data of each row
        while($row = $requete->fetch_assoc()) {
            $utilisateur = $row['Username'];
            $message = $row['Message'];
            $date = $row['Date'];
            echo ("L'utilisateur $utilisateur à $date à dit : $message .<br>");
        }
    } else {
        echo "0 chats actuellement !";
    }
    ?>
</h3>
</body>
</html>