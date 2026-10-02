const WORKER_URL = "https://steam-api-proxy.thomasallen2303.workers.dev/";
const container = document.getElementById("games-container");

async function displayRecentlyPlayedGames(steamId) {
  const endpoint = `/IPlayerService/GetRecentlyPlayedGames/v0001/?steamid=${steamId}&format=json`;
  
  try {
    const response = await fetch(`${WORKER_URL}${endpoint}`);
    const data = await response.json();
    const games = data.response.games;

    if (!games || games.length === 0) {
      container.textContent = "No recently played games found (or profile is private).";
      return;
    }

    // Clear loading text
    container.innerHTML = "";

    // Loop through each game and construct the clickable HTML card
    games.forEach((game) => {
      const card = document.createElement("a");
      card.className = "game-card";
      
      // Link to the official Steam Store page for this app ID
      card.href = `https://store.steampowered.com/app/${game.appid}`;
      card.target = "_blank";
      card.rel = "noopener noreferrer";

      // Steam Store High-Res Header Image
      const imageUrl = `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`;

      // Convert minutes to hours
      const hoursForever = (game.playtime_forever / 60).toFixed(1);
      const hours2Weeks = (game.playtime_2weeks / 60).toFixed(1);

      card.innerHTML = `
        <img src="${imageUrl}" alt="${game.name}">
        <p class="game-title">${game.name}</p>
        <span class="game-playtime">${hours2Weeks} hrs past 2 weeks</span>
        <span class="game-playtime-total">${hoursForever} hrs total</span>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    container.textContent = `Error loading games: ${error.message}`;
  }
}

displayRecentlyPlayedGames("76561198271858202");