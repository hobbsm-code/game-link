import { useQuery } from '@apollo/client';
import { GET_LEADERBOARD } from '../utils/queries';
import { Container, Table } from 'react-bootstrap';
import Auth from '../utils/auth';

const Leaderboard = () => {
    const { loading, error, data } = useQuery(GET_LEADERBOARD);

    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2>Error loading leaderboard.</h2>;

    const leaderboard = data?.getLeaderboard || [];

    return (
        // Display the leaderboard if logged in
        Auth.loggedIn()? (

        <Container className="mt-4">
            <h1 className="text-center">🏆 Leaderboard 🏆</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Game</th>
                        <th>Total Hours Played</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map((entry: any, index: number) => (
                        <tr key={index}>
                            <td>#{index + 1}</td>
                            <td>{entry.username}</td>
                            <td>{entry.title}</td>
                            <td>{entry.totalTimePlayed.toFixed(2)} hrs</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>) : (
            <h1>Please log in to view the leaderboard.</h1>
        )
        
    );
};

export default Leaderboard;
