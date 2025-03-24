document.addEventListener("DOMContentLoaded", () => {
    async function fetchDiscordData() {
      const inviteCode = "BZrGsRc4qq"; // Remplacez par votre code d'invitation
      try {
        const response = await fetch(`https://discord.com/api/v9/invites/${inviteCode}?with_counts=true`);
        if (!response.ok) throw new Error("Erreur de récupération des données");
        const data = await response.json();
        document.getElementById("discord-icon").src = `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.png`;
        document.getElementById("discord-name").innerText = data.guild.name;
        document.getElementById("discord-members").innerText = `${data.approximate_presence_count} en ligne • ${data.approximate_member_count} membres`;
        document.getElementById("discord-join").href = `https://discord.gg/${inviteCode}`;
      } catch (error) {
        console.error("Erreur lors de la récupération des données Discord:", error);
      }
    }
  
    fetchDiscordData();
  
    // Effet de fade-in pour l'en-tête et le texte
    document.querySelectorAll(".fade-in").forEach((element, index) => {
      setTimeout(() => {
        element.style.opacity = "1";
      }, index * 300);
    });
  
    // Ajout d'un effet de survol sur la bannière
    document.querySelector(".hero").addEventListener("mouseover", () => {
      document.querySelector(".hero h1").style.color = "var(--primary-color)";
    });
  
    document.querySelector(".hero").addEventListener("mouseleave", () => {
      document.querySelector(".hero h1").style.color = "var(--text-color)";
    });
  
    // Ajout d'un délai d'animation pour chaque lien de la nav
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link, index) => {
      link.style.setProperty("--delay", index);
    });
  
    // Gestion du lien actif
    const currentPath = window.location.hash;
    navLinks.forEach(link => {
      if (link.getAttribute("href") === currentPath) {
        link.classList.add("active");
      }
    });
  });

  const express = require('express');
const axios = require('axios');
const app = express();

const CLIENT_ID = '1353527356836544532';
const CLIENT_SECRET = '1vqC6X3qH1znuKvReaMqYj_1k754sj6l'; // Trouvé dans le portail Discord
const REDIRECT_URI = 'http://localhost:3000/auth/discord/callback';

app.get('/auth/discord/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Code manquant');

  try {
    // Échanger le code contre un jeton d'accès
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      scope: 'identify',
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const accessToken = tokenResponse.data.access_token;

    // Récupérer les informations de l'utilisateur
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const user = userResponse.data;
    console.log('Utilisateur connecté:', user);

    // Rediriger ou afficher une page de confirmation
    res.send(`Bienvenue, ${user.username}#${user.discriminator} !`);
  } catch (error) {
    console.error('Erreur lors de l\'authentification:', error);
    res.status(500).send('Erreur lors de la connexion');
  }
});

app.listen(3000, () => console.log('Serveur démarré sur http://localhost:3000'));