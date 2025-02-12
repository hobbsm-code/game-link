import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

import Auth from '../utils/auth';
import { removeGameId } from '../utils/localStorage';
import type { Game } from '../models/Game';
import { GET_ME } from '../utils/queries';
import { REMOVE_GAME, SUBMIT_PLAYTIME } from '../utils/mutations';

const SavedGames = () => {

  const { data } = useQuery(GET_ME);

  const userData = data?.me || {};
  const userDataLength = Object.keys(userData).length;

  const [removeGame] = useMutation(REMOVE_GAME);

  const [submitPlaytime] = useMutation(SUBMIT_PLAYTIME); 
  const [startTime, setStartTime] = useState<number | null>(null);
  const [playtime, setPlaytime] = useState(0);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      setPlaytime(parseFloat(((Date.now() - startTime) / (1000 * 60 * 60)).toFixed(2))); // Update in hours
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [startTime]);

 // Start tracking playtime
 const handleStartPlaying = (gameId: string) => {
  setStartTime(Date.now());
  setPlaytime(0);
  setActiveGameId(gameId);
};

// Submit playtime
  const handleSubmitPlaytime = async () => {
    if (!startTime || !activeGameId) return;

    const endTime = Date.now();
    const hoursPlayed = parseFloat(((endTime - startTime) / (1000 * 60 * 60)).toFixed(2));

    if (!Auth.loggedIn()) {
        alert('You must be logged in to submit playtime.');
        return;
    }

    console.log("Submitting playtime data:", { gameId: activeGameId, hours: hoursPlayed });

    

    try {
      const { data } = await submitPlaytime({
          variables: { gameId: activeGameId, hours: hoursPlayed },
          refetchQueries: [{ query: GET_ME }], // Refetch updated data
      });

      console.log("✅ Mutation successful. Updated playtime:", data.submitPlaytime.time_played);
      alert(`Total time played: ${data.submitPlaytime.time_played} hours`);
  } catch (err) {
      console.error("❌ GraphQL Mutation Error:", err);
  }


    setStartTime(null);
    setActiveGameId(null);
};
  // create function that accepts the game's mongo _id value as param and deletes the games from the database
  const handleDeleteGame = async (gameId: string) => {
    removeGameId(gameId);
    
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    

    if (!token) {
      return false;
    }

    try {
      removeGame({
        variables: { gameId },
      });

      removeGameId(gameId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...log in to view your saved games</h2>;
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved games!</h1>
          ) : (
            <h1>Viewing saved games!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedGames.length
            ? `Viewing ${userData.savedGames.length} saved ${
                userData.savedGames.length === 1 ? 'game' : 'games'
              }:`
            : 'You have no saved games!'}
        </h2>
        <Row>
          {console.log(userData.savedGames)}
          {userData.savedGames.map((game: Game) => {
            return (
              <Col md='4'>
                <Card key={game.gameId} border='dark'>
                  {game.thumbnail ? (
                    <Card.Img
                      src={game.thumbnail}
                      alt={`The cover for ${game.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{game.title}</Card.Title>
                    {game.freetogame_profile_url? (<Card.Title> 
                      <>
                      <a href={game.freetogame_profile_url} target='_blank' rel='noopener noreferrer'> View {game.title} on freetogame.com </a>
                      </>
                    </Card.Title>) : null}
                    
                    <Card.Text>{game.short_description }</Card.Text>

                    <Button
                      className='btn-block btn-danger'
                      onClick={() => {
                        
                        handleDeleteGame(game.gameId)}}
                    >
                      Delete this Game!
                    </Button>
                    
                    {activeGameId === game.gameId ? (
                  <>
                    <p className="mt-2 small">
                    <strong>Total Time Played:</strong> {game.time_played || 0} hours <br />
                    <strong>Current Session:</strong> {playtime} hours
                    </p>

                    <Button className="btn-block btn-success" onClick={handleSubmitPlaytime}>
                      Submit Playtime
                    </Button>
                  </>
                ) : (
                  <Button className="btn-block btn-primary" onClick={() => handleStartPlaying(game.gameId)}>
                    Start Playing
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

export default SavedGames;
