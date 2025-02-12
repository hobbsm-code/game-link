import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import type { FormEvent } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';

import Auth from '../utils/auth';

import { searchGameAPI } from '../utils/API';
import { SAVE_GAME } from '../utils/mutations';
import { saveGameIds, getSavedGameIds } from '../utils/localStorage';
import type { Game } from '../models/Game';


const SearchGames = () => {
  // create state for holding returned google api data
  const [searchedGames, setSearchedGames] = useState<Game[]>([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  

  // create state to hold saved gameId values
  const [savedGameIds, setSavedGameIds] = useState(getSavedGameIds());

  const [saveGame] = useMutation(SAVE_GAME);

  // set up useEffect hook to save `savedGameIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup

  
  
  useEffect(() => {
    return () => saveGameIds(savedGameIds);
  }, [savedGameIds]);
  
  const categories = [
    "mmorpg", "shooter", "strategy", "moba", "racing", "sports", "social", "sandbox",
    "open-world", "survival", "pvp", "pve", "pixel", "voxel", "zombie", "turn-based",
    "first-person", "third-person", "top-down", "tank", "space", "sailing", "side-scroller",
    "superhero", "permadeath", "card", "battle-royale", "mmo", "mmofps", "mmotps", "3d",
    "2d", "anime", "fantasy", "sci-fi", "fighting", "action-rpg", "action", "military",
    "martial-arts", "flight", "low-spec", "tower-defense", "horror", "mmorts"
  ].sort((a, b) => a.localeCompare(b)); // Sorts alphabetically
  
  // create method to search for games and set state on form submit
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchInput.trim()) {
      return false;
    }

    try {
      
       let category = encodeURIComponent(searchInput.trim());

      const response = await searchGameAPI(category);
      
      
      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const  items  = await response.json();
      console.log({items});
      

      const gameData = items.map((game: Game) => ({
        gameId: game.id,
        publisher: game.publisher || ['No publisher to display'],
        title: game.title,
        short_description: game.short_description,
        thumbnail: game.thumbnail,
        freetogame_profile_url: game.freetogame_profile_url,
        category: game.genre,
      }));

      setSearchedGames(gameData);
     
      // setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a game to our database
  const handleSaveGame = async (gameId: string) => {
    // find the game in `searchedGames` state by the matching id
    const gameToSave: Game = searchedGames.find((game) => game.gameId === gameId)!;

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveGame({
        variables: { input: gameToSave }
      });

      // if game successfully saves to user's account, save game id to state
      setSavedGameIds([...savedGameIds, gameToSave.gameId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Come join our community of gamers. 
              Learn tips, Get tricks, & the latest news on your favorite games.
              Search and enjoy!!!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                {/* <Form.Select
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  // type='text'
                  size='lg'
                  // placeholder='Search for a game by genre (Shooter,Strategy,MMORPG etc.)'
                /> */}
                <Form.Select
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              size="lg"
            >
              <option value="">Select a Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.replace(/-/g, " ").toUpperCase()} {/* Formats text */}
                </option>
              ))}
            </Form.Select>
              

              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedGames.length
            ? `Viewing ${searchedGames.length} results
            `
            : 'Search for a game to begin'}
        </h2>
         
        <Row>
          {searchedGames.map((game) => {
            return (
              <Col md="4" key={game.gameId}>
                <Card border='dark'>
                  {game.thumbnail ? ( 
                    <Card.Img src={game.thumbnail} alt={`The cover for ${game.title}`} variant='top' />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{game.title}</Card.Title>
                    <p className='small'>Authors: {game.publisher}</p>
                    <Card.Text>{game.short_description}</Card.Text>
                    <Card.Title><a href={game.freetogame_profile_url} target="_blank" rel="noopener nonreferrer"> View {game.title} on freetogame.com </a>
                    </Card.Title>

                    
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedGameIds?.some((savedGameId: string) => savedGameId === game.gameId)}
                        className='btn-block btn-info'
                        onClick={() => handleSaveGame(game.gameId)}>
                        {savedGameIds?.some((savedGameId: string) => savedGameId === game.gameId)
                          ? 'This game has already been saved!'
                          : 'Save this Game!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchGames;

// // src/App.tsx
// // import React, { useEffect, useState } from 'react';

// // Define a TypeScript interface for a game
// interface Game {
//   id: number;
//   title: string;
//   short_description: string;
//   thumbnail: string;
//   freetogame_profile_url: string;
//   // Add other properties as needed (e.g., thumbnail, description)
// }

// // const App: React.FC = () => {
// //   const [games, setGames] = useState<Game[]>([]);
// //   const [error, setError] = useState<string | null>(null);

// //   // Fetch the game data from the back end when the component mounts
// //   useEffect(() => {
// //     const fetchGames = async () => {
// //       try {
// //         const response = await fetch('/api/games');
// //         if (!response.ok) {
// //           throw new Error('Network response was not ok');
// //         }
// //         // Assuming the API returns an array of games
// //         const data: Game[] = await response.json();
// //         setGames(data);
// //       } catch (error: any) {
// //         setError(error.message);
// //         console.error('Error fetching games:', error);
// //       }
// //     };

// //     fetchGames();
// //   }, []);

// //   return (
// //     <div>
// //       <h1>Shooter Games</h1>
// //       {error && <p>Error: {error}</p>}
// //       <ul>
// //         {games.map((game) => (
// //           <div>
// //           <li key={game.id}>{game.title}</li>
// //           <li key={game.id}>{game.short_description}</li>
// //           <li key={game.id}></li>
// //             <img src={game.thumbnail} alt={game.title} />
// //           <li key={game.id}></li>
// //           <li key={game.id}>{game.freetogame_profile_url}</li>
// //           </div>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // };
// // src/App.tsx
// import React, { useEffect, useState, FormEvent } from 'react';
// import {searchGameAPI} from '../utils/API';
// // Define a TypeScript interface for a game object (adjust properties as needed)


// const App: React.FC = () => {
//   const [games, setGames] = useState<Game[]>([]);
//   const [category, setCategory] = useState<string>('Shooter');
//   const [search, setSearch] = useState<string>('');
//   const [error, setError] = useState<string | null>(null);

//   // Function to fetch games by category from your back-end endpoint
//   const fetchGames = async (category: string) => {
//     try {
//       const response = await  searchGameAPI(category);
//       ;
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data: Game[] = await response.json();
//       setGames(data);
//     } catch (error: any) {
//       setError(error.message);
//       console.error('Error fetching games:', error);
//     }
//   };

//   // Fetch games when the component mounts and whenever the category changes
//   useEffect(() => {
//     fetchGames(category);
//   }, [category]);

//     fetchGames(category);
    
//   // Handle form submission to update the category
//   const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (search.trim() !== '') {
//       setCategory(search.trim());
//     }
//   };

//   return (
//     <div>
//       <h1>Search Games by Category</h1>
//       <form onSubmit={handleSearchSubmit}>
//         <input
//           type="text"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Enter category (e.g., Shooter, RPG, etc.)"
//         />
//         <button type="submit">Search</button>
//       </form>
//       {error && <p style={{ color: 'red' }}>Error: {error}</p>}
//       <ul>
//         {games.map((game) => (
//           <>
//           <li key={game.id}>{game.title}</li>
//           <li key={game.id}> {game.thumbnail}</li>
//           </>
          
          
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default App;



