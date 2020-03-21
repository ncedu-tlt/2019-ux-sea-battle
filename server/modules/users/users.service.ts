import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDAO } from "../db/domain/user.dao";
import { Repository } from "typeorm";
import { RegisterDTO } from "../../../common/dto/auth.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserDAO)
        private usersRepository: Repository<UserDAO>
    ) {}

    async findByEmail(email: string): Promise<UserDAO> {
        return await this.usersRepository.findOne({
            where: {
                email: email
            }
        });
    }

    async findById(id: number): Promise<UserDAO> {
        return await this.usersRepository.findOne({
            where: {
                id: id
            }
        });
    }

    async create(user: RegisterDTO): Promise<UserDAO> {
        return await this.usersRepository.save(user);
    }
}
