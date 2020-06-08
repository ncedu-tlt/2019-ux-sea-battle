import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
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

    async create(game: GameDAO, userId: number): Promise<void> {
        const user: UserDAO = { ...(await this.usersService.findById(userId)) };
        const participant = {
            user,
            game
        };
        await this.participantRepository.save(participant);
    }

    async getParticipantByUserId(userId: number): Promise<ParticipantDAO> {
        const user: UserDAO = await this.usersService.findById(userId);
        if (!user) {
            throw new HttpException(
                "users/userDoesNotExist",
                HttpStatus.NOT_FOUND
            );
        }

        return this.participantRepository.findOne({
            where: {
                user: user.id
            }
        });
    }
}
