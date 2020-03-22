import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { UserDAO } from "../db/domain/user.dao";
import { LoginResponseDTO } from "../../../common/dto/login-response.dto";
import { CryptographerService } from "./cryptographer.service";
import { PayloadModel } from "../../../common/models/payload.model";
import { LoginRequestDTO } from "common/dto/login-request.dto";
import { RegisterRequestDTO } from "common/dto/register-request.dto";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private cryptoService: CryptographerService,
        private readonly jwtService: JwtService
    ) {}

    public async validate(payload: PayloadModel): Promise<UserDAO> {
        return await this.usersService.findById(payload.sub);
    }

    public async login(loginDTO: LoginRequestDTO): Promise<LoginResponseDTO> {
        const user = await this.usersService.findByEmail(loginDTO.email);
        if (!user) {
            throw new HttpException("Invalid email", HttpStatus.UNAUTHORIZED);
        }
        const isPassValid = this.cryptoService.checkPassword(
            user.password,
            loginDTO.password
        );
        if (isPassValid) {
            const payload = {
                sub: user.id,
                nickname: user.nickname,
                iat: Number(Date.now())
            };
            const accessToken = this.jwtService.sign(payload, {
                expiresIn: "1h"
            });
            return {
                accessToken: accessToken,
                ...payload
            };
        }
        throw new HttpException("Invalid password", HttpStatus.UNAUTHORIZED);
    }

    public async register(registerDTO: RegisterRequestDTO): Promise<any> {
        const user = await this.usersService.findByEmail(registerDTO.email);
        if (user) {
            throw new HttpException(
                "User is already exist",
                HttpStatus.BAD_REQUEST
            );
        }
        const candidateUser: RegisterRequestDTO = {
            ...registerDTO,
            password: this.cryptoService.hashPassword(registerDTO.password)
        };
        await this.usersService.create(candidateUser);
        return {
            message: "User created"
        };
    }
}
