# 💬 Système de Messagerie en Temps Réel

## 📜 Table des matières

- [📖 Description](#-description)
- [🚀 Fonctionnalités](#-fonctionnalités)
- [🛠️ Technologies utilisées](#-technologies-utilisées)
- [📌 Prérequis](#-prérequis)
- [⚙️ Installation](#-installation)
- [🖥️ Aperçu](#-aperçu)
- [🤝 Contribution](#-contribution)
- [📄 License](#-license)

---

## 📖 Description  

Bienvenue dans le **Système de Messagerie en Temps Réel** ! 🚀  
Ce projet est une plateforme de discussion permettant aux utilisateurs de communiquer instantanément via une interface moderne et intuitive. Il est conçu en **Node.js**, avec **Socket.io** pour la gestion du chat en temps réel, et une base de données **MySQL** pour stocker les utilisateurs et leurs messages.

L'objectif de ce projet est de proposer un **chat fluide et réactif**, sans utiliser de framework côté serveur, pour mettre en avant la puissance des WebSockets et des technologies de développement web modernes.

---

## 🚀 Fonctionnalités

✔️ **Authentification sécurisée** (inscription & connexion).  
💬 **Chat en temps réel** grâce à **Socket.io**.  
📌 **Affichage des messages envoyés et reçus**.  
🕒 **Horodatage des messages** avec gestion des fuseaux horaires.  
🗑️ **Suppression des messages**.  
⚡ **Interface moderne en mode sombre** pour une meilleure expérience utilisateur.  

---

## 🛠️ Technologies utilisées  

- **💻 Backend** : Node.js, Socket.io  
- **🗄️ Base de données** : MySQL  
- **🎨 Frontend** : HTML, CSS, JavaScript  
- **🔐 Sécurité** : Bcrypt pour le hachage des mots de passe  

---

## 📌 Prérequis

Avant de commencer, assurez-vous d'avoir installé :  

- **Node.js** (version 14 ou supérieure)  
- **MySQL** (serveur et client)  
- Un éditeur de code (VS Code recommandé)  

---

## ⚙️ Installation  

1️⃣ **Clonez le dépôt**  
```bash
git clone https://github.com/LucSarrazin/Systeme-de-Chat.git
cd Systeme-de-messagerie
```

2️⃣ **Installez les dépendances**  
```bash
npm install
```

3️⃣ **Configurez la base de données**  
- Importez le fichier `database.sql` dans MySQL.  
- Modifiez `config/database.js` avec vos identifiants de base de données.  

4️⃣ **Lancez le serveur**  
```bash
node index.js
```

5️⃣ **Accédez au chat**  
Ouvrez votre navigateur et allez sur :  
```
http://localhost:3000
```

---

## 🖥️ Aperçu  

✨ **Interface utilisateur en mode sombre**  
📡 **Messages envoyés et reçus en temps réel**  
🔐 **Connexion sécurisée des utilisateurs**  

---

## 🤝 Contribution  

Les contributions sont les bienvenues ! 🎉  

1. **Forkez** le projet  
2. **Créez** une branche (`feature/nouvelle-fonctionnalite`)  
3. **Faites** vos modifications  
4. **Soumettez** une pull request  

---

## 📄 License  

📌 Ce projet est un projet personnel éducatif et ne doit pas être utilisé à des fins commerciales.  

🚀 *amusez-vous bien avec mon système de messagerie !* 🎉  

