import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDAO } from "../db/domain/user.dao";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { RegisterRequestDTO } from "../../../common/dto/register-request.dto";
import { UserDTO } from "../../../common/dto/user.dto";
import { UserUpdateDto } from "../../../common/dto/user-update.dto";
import { UserCreateDto } from "../../../common/dto/user-create.dto";
import { CryptographerService } from "../auth/cryptographer.service";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserDAO)
        private usersRepository: Repository<UserDAO>,
        private cryptoService: CryptographerService
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

    findByEmailOrNickname(email: string, nickname: string): Promise<UserDAO> {
        return this.usersRepository.findOne({
            where: [{ email }, { nickname }]
        });
    }

    findById(id: number): Promise<UserDAO> {
        return this.usersRepository.findOne(id);
    }

    create(user: RegisterRequestDTO): Promise<UserDAO> {
        return this.usersRepository.save(user);
    }

    async getUser(id: number): Promise<UserDTO> {
        const user = await this.usersRepository.findOne(id);
        if (!user)
            throw new HttpException(
                "users/userNotExist",
                HttpStatus.BAD_REQUEST
            );
        return {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            avatarUrl: user.avatarUrl,
            role: user.role,
            balance: user.balance,
            experience: user.experience,
            isAnon: user.isAnon,
            status: user.status
        };
    }

    async createUser(createDTO: UserCreateDto): Promise<void> {
        const user = await this.findByEmailOrNickname(
            createDTO.email,
            createDTO.nickname
        );
        if (user)
            throw new HttpException(
                "users/userAlreadyExist",
                HttpStatus.BAD_REQUEST
            );
        const candidateUser = {
            ...createDTO,
            password: this.cryptoService.hashPassword(createDTO)
        };
        await this.usersRepository.save(candidateUser);
    }

    async update(updateDTO: UserUpdateDto): Promise<UpdateResult> {
        const user = await this.findByEmailOrNickname(
            updateDTO.email,
            updateDTO.nickname
        );
        if (user)
            throw new HttpException(
                "users/userAlreadyExist",
                HttpStatus.BAD_REQUEST
            );
        const candidateUser = {
            ...updateDTO,
            password: this.cryptoService.hashPassword(updateDTO)
        };
        return await this.usersRepository.update(updateDTO.id, candidateUser);
    }

    async delete(id: number): Promise<DeleteResult> {
        const user = await this.usersRepository.findOne(id);
        if (!user)
            throw new HttpException(
                "users/userNotExist",
                HttpStatus.BAD_REQUEST
            );
        return this.usersRepository.delete(id);
    }
}
