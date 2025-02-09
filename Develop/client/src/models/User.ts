import { Game } from './Game';

export interface User {
    username: string | null;
    password: string | null;
    email: string | null;
    savedGames: Game[];
}