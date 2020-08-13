import { UserDAO } from "../../../server/modules/db/domain/user.dao";
import { GameDAO } from "../../../server/modules/db/domain/game.dao";

export interface PlayerDataModel {
    user: UserDAO;
    game: GameDAO;
}
