import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
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


import { GET_FREE_GAMES } from '../utils/queries';
import { SAVE_GAME } from '../utils/mutations';
import {  getSavedGameIds } from '../utils/localStorage';
import type { Game } from '../models/Game';


const SearchGames = () => {
  const [searchedGames, setSearchedGames] = useState<Game[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedGameIds, setSavedGameIds] = useState(getSavedGameIds());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [saveGame] = useMutation(SAVE_GAME);

  const { loading, error } = useQuery(GET_FREE_GAMES, {
    variables: { category: selectedCategory },
    skip: !selectedCategory, // Skip query until a category is selected
    onCompleted: (data) => {
      if (data && data.getFreeGames) {
        const gameData = data.getFreeGames.map((game: Game) => ({
          gameId: game.id? game.id.toString(): undefined,
          id: game.id? game.id.toString(): undefined,
          publisher: game.publisher || 'No publisher to display',
          title: game.title,
          short_description: game.short_description,
          thumbnail: game.thumbnail,
          freetogame_profile_url: game.freetogame_profile_url,
          category: game.genre,
        }));
        
        setSearchedGames(gameData);
      }
    }
  });
  
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

    setSelectedCategory(searchInput);
  };



  
  const handleSaveGame = async (gameId: string) => {
    
    const gameToSave: Game | undefined = searchedGames.find(
      (game) => game.gameId === gameId
    );
  
    if (!gameToSave) {
      console.error("Game not found in searchedGames:", gameId);
      return false;
    }
  
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;
  
    if (!token) {
      console.error("User not authenticated");
      return false;
    }
  
    console.log("Game input for mutation:", gameToSave);
  
    try {
      await saveGame({
        variables: { input: 
          { ...gameToSave, 
            gameId: gameToSave.gameId,
            title: gameToSave.title,
            short_description: gameToSave.short_description,
            thumbnail: gameToSave.thumbnail,
            freetogame_profile_url: gameToSave.freetogame_profile_url,
            platform: gameToSave.platform,
            genre: gameToSave.genre,
            publisher: gameToSave.publisher,
          
          } }
      });
  
      setSavedGameIds([...savedGameIds, gameToSave.gameId]);
    } catch (err) {
      console.error("Error saving game:", err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Games!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                
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
          {loading? 'Loading....':searchedGames.length
            ? `Viewing ${searchedGames.length} results
            `
            : 'Search for a game to begin'}
        </h2>
         
        {error && <p>Error fetching games: {error.message}</p>}

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
                    <Card.Title><a href={game.freetogame_profile_url} target="_blank" rel="noopener noreferrer"> View {game.title} on freetogame.com </a>
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
}


export default SearchGames;

