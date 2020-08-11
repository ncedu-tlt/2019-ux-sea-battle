import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ParticipantDAO } from "../db/domain/participant.dao";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { UserDAO } from "../db/domain/user.dao";
import { GameDAO } from "../db/domain/game.dao";
import { GameStatusEnum } from "../../../common/game-status.enum";

@Injectable()
export class ParticipantService {
    constructor(
        @InjectRepository(ParticipantDAO)
        private participantRepository: Repository<ParticipantDAO>,
        private usersService: UsersService
    ) {}

    async create(game: GameDAO, userId: number): Promise<ParticipantDAO> {
        const user: UserDAO = await this.usersService.findById(userId);
        const participant: ParticipantDAO = new ParticipantDAO();
        participant.user = Promise.resolve(user);
        participant.game = Promise.resolve(game);
        return await this.participantRepository.save(participant);
    }

    async getParticipantByUserId(userId: number): Promise<ParticipantDAO> {
        const user: UserDAO = await this.usersService.findById(userId);
        const participants: ParticipantDAO[] = await this.participantRepository.find(
            {
                where: {
                    user: user.id
                }
            }
        );
        for (const [i, value] of participants.entries()) {
            const game = await value.game;
            if (game.status === GameStatusEnum.STARTED) {
                return participants[i];
            }
        }
    }
}
