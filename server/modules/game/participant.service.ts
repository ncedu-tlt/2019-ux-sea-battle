import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ParticipantDAO } from "../db/domain/participant.dao";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { UserDAO } from "../db/domain/user.dao";
import { GameDAO } from "../db/domain/game.dao";

@Injectable()
export class ParticipantService {
    constructor(
        @InjectRepository(ParticipantDAO)
        private participantRepository: Repository<ParticipantDAO>,
        private usersService: UsersService
    ) {}

    async create(game: GameDAO, userId: number): Promise<ParticipantDAO> {
        const user: UserDAO = await this.usersService.findById(userId);
        const participant = {
            user,
            ...game
        };
        Logger.debug("participant.service - creating participant:");
        Logger.debug(participant);
        return await this.participantRepository.save(participant);
    }

    async getParticipantByUserId(userId: number): Promise<ParticipantDAO> {
        const user: UserDAO = await this.usersService.findById(userId);
        return this.participantRepository.findOne({
            where: {
                user: user.id
            }
        });
    }
}
