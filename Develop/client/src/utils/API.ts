import type { User } from '../models/User.js';
import type { Game } from '../models/Game.js';

// route to get logged in user's info (needs the token)
export const getMe = (token: string) => {
  return fetch('/api/users/me', {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  });
};

export const createUser = (userData: User) => {
  return fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

export const loginUser = (userData: User) => {
  return fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

// save game data for a logged in user
export const saveGame = (gameData: Game, token: string) => {
  return fetch('/api/users', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(gameData),
  });
};

// remove saved game data for a logged in user
export const deleteGame = (gameId: string, token: string) => {
  return fetch(`/api/users/games/${gameId}`, {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};



// export const searchGameAPI = (category?: string) => {
//   return fetch(`https://game-link-backend.onrender.com/api/games${category ? `?category=${encodeURIComponent(category)}` : ''}` ,{
//     method: 'GET',
//     headers: { 'Content-Type': 'application/json' },
//   });
// };

export const searchGameAPI = (category?: string) => {
  return fetch (`https://www.freetogame.com/api/games?category=${category}`);

}


// export const searchGameAPI = (category:string) => {
//   return fetch(`api/games?category=${category}`);
// };


