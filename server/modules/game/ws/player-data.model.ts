import { UserDAO } from "../../db/domain/user.dao";
import { GameDAO } from "../../db/domain/game.dao";

export interface PlayerDataModel {
    user: UserDAO;
    game: GameDAO;
}
