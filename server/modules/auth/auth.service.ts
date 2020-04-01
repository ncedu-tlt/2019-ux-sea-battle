import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { UserDAO } from "../db/domain/user.dao";
import { LoginResponseDTO } from "../../../common/dto/login-response.dto";
import { CryptographerService } from "./cryptographer.service";
import { TokenPayloadModel } from "../../../common/models/token-payload.model";
import { LoginRequestDTO } from "common/dto/login-request.dto";
import { RegisterRequestDTO } from "common/dto/register-request.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
        private cryptoService: CryptographerService,
        private jwtService: JwtService
    ) {}

    public async validate(payload: TokenPayloadModel): Promise<UserDAO> {
        return await this.usersService.findById(payload.sub);
    }

    public async login(loginDTO: LoginRequestDTO): Promise<LoginResponseDTO> {
        const user = await this.usersService.findByEmail(loginDTO.email);
        if (user) {
            const isPassValid = this.cryptoService.checkPassword(
                user.password,
                loginDTO.password
            );
            if (isPassValid) {
                const payload = {
                    sub: user.id,
                    nickname: user.nickname
                };
                const accessToken = this.jwtService.sign(payload, {
                    expiresIn: this.configService.get("tokenExpiresIn")
                });
                return {
                    accessToken: accessToken,
                    ...payload
                };
            }
        }
        throw new HttpException(
            "auth/invalidCredentials",
            HttpStatus.UNAUTHORIZED
        );
    }

    public async register(registerDTO: RegisterRequestDTO): Promise<void> {
        const user = await this.usersService.findByEmailOrNickname(
            registerDTO.email,
            registerDTO.nickname
        );
        if (user) {
            throw new HttpException(
                "auth/userAlreadyExist",
                HttpStatus.BAD_REQUEST
            );
        }
        const candidateUser: RegisterRequestDTO = {
            ...registerDTO,
            password: this.cryptoService.hashPassword(registerDTO.password)
        };
        await this.usersService.create(candidateUser);
    }
}
