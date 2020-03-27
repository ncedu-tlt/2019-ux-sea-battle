import { Body, Controller, Get, Post } from "@nestjs/common";
import { UsersDto } from "common/dto/users.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersDao } from "../db/domain/users.dao";

@Controller("/api/users")
export class UsersController {
    constructor(
        @InjectRepository(UsersDao)
        private usersRepository: Repository<UsersDao>
    ) {}

    @Get()
    async getAll(): Promise<UsersDto[]> {
        return this.usersRepository.find();
    }

    @Post()
    async add(@Body() user: UsersDto): Promise<UsersDto> {
        return this.usersRepository.save(user);
    }
}
