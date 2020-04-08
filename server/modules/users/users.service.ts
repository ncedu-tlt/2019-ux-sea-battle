import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDAO } from "../db/domain/user.dao";
import { DeleteResult, Repository } from "typeorm";
import { RegisterRequestDTO } from "../../../common/dto/register-request.dto";
import { UserDTO } from "../../../common/dto/user.dto";
import { UpdateUserDto } from "../../../common/dto/update-user.dto";
import { CreateUserDto } from "../../../common/dto/create-user.dto";
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
        if (!user) {
            throw new HttpException(
                "users/userDoesNotExist",
                HttpStatus.NOT_FOUND
            );
        }
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

    async createUser(createDTO: CreateUserDto): Promise<UserDTO> {
        const user = await this.findByEmailOrNickname(
            createDTO.email,
            createDTO.nickname
        );
        if (user) {
            throw new HttpException(
                "users/userAlreadyExist",
                HttpStatus.CONFLICT
            );
        }
        if (!createDTO.password) {
            return await this.usersRepository.save(createDTO);
        } else {
            const candidateUser = {
                ...createDTO,
                password: this.cryptoService.hashPassword(createDTO.password)
            };
            return await this.usersRepository.save(candidateUser);
        }
    }

    async update(updateDTO: UpdateUserDto): Promise<UserDTO> {
        if (!updateDTO.password) {
            await this.usersRepository.update(updateDTO.id, updateDTO);
        } else {
            const candidateUser = {
                ...updateDTO,
                password: this.cryptoService.hashPassword(updateDTO.password)
            };
            await this.usersRepository.update(updateDTO.id, candidateUser);
        }
        return await this.findById(updateDTO.id);
    }

    async delete(id: number): Promise<DeleteResult> {
        const user = await this.usersRepository.findOne(id);
        if (!user) {
            throw new HttpException(
                "users/userDoesNotExist",
                HttpStatus.NOT_FOUND
            );
        }
        return this.usersRepository.delete(id);
    }
}
