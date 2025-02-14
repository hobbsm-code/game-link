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

// Load Games from the API

// export const searchGameAPI = (category:string) => {
//   return fetch(`http://localhost:3001/api/games?category=${category}`);
// };

// Get Games from the API

// export const searchGameAPI = () => {
//   return fetch(`api/games`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     }
//   });
  
// }

export const searchGameAPI = (category?: string) => {
  return fetch(`https://cors-anywhere.herokuapp.com/https://www.freetogame.com/api/games?category=${category}`, {
    // mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' }
  });
};

// export const searchGameAPI = (category?: string) => {
//   return fetch(`/games${category ? `?category=${encodeURIComponent(category)}` : ''}` ,{
//     method: 'GET',
//     headers: { 'Content-Type': 'application/json' },
//   });
// };



// export const searchGameAPI = (category:string) => {
//   return fetch(`api/games?category=${category}`);
// };


