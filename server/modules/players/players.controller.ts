import { Body, Controller, Get, Post } from "@nestjs/common";
import { PlayerDTO } from "common/dto/player.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserDAO } from "../db/domain/user.dao";

@Controller("/api/players")
export class PlayersController {
    constructor(
        @InjectRepository(UserDAO)
        private usersRepository: Repository<UserDAO>
    ) {}

    @Get()
    getAll(): Promise<PlayerDTO[]> {
        return this.usersRepository.find();
    }

    @Post()
    add(@Body() player: PlayerDTO): Promise<PlayerDTO> {
        return this.usersRepository.save(player);
    }
}
