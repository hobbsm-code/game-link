import { useQuery, useMutation } from '@apollo/client';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

import Auth from '../utils/auth';
import { removeGameId } from '../utils/localStorage';
import type { Game } from '../models/Game';
import { GET_ME } from '../utils/queries';
import { REMOVE_GAME } from '../utils/mutations';

const SavedGames = () => {

  const { data } = useQuery(GET_ME);

  const userData = data?.me || {};
  const userDataLength = Object.keys(userData).length;

  const [removeGame] = useMutation(REMOVE_GAME);

  // create function that accepts the game's mongo _id value as param and deletes the games from the database
  const handleDeleteGame = async (gameId: string) => {
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
    return <h2>LOADING...</h2>;
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
                    <p className='small'>Authors: {game.publisher}</p>
                    <Card.Text>{game.short_description }</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteGame(game.gameId)}
                    >
                      Delete this Game!
                    </Button>
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
