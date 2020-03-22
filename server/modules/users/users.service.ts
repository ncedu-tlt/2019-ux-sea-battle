import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDAO } from "../db/domain/user.dao";
import { Repository } from "typeorm";
import { RegisterRequestDTO } from "../../../common/dto/register-request.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserDAO)
        private usersRepository: Repository<UserDAO>
    ) {}

    getAll(): Promise<UserDAO[]> {
        return this.usersRepository.find();
    }

    findByEmail(email: string): Promise<UserDAO> {
        return this.usersRepository.findOne({
            where: {
                email: email
            }
        });
    }

    findByNickname(nickname: string): Promise<UserDAO> {
        return this.usersRepository.findOne({
            where: {
                nickname: nickname
            }
        });
    }

    findById(id: number): Promise<UserDAO> {
        return this.usersRepository.findOne(id);
    }

    async create(user: RegisterRequestDTO): Promise<UserDAO> {
        return await this.usersRepository.save(user);
    }
}
