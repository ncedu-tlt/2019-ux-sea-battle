import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { LoginDTO, RegisterDTO } from "../../../common/dto/auth.dto";
import { JwtService } from "@nestjs/jwt";
import { UserDAO } from "../db/domain/user.dao";
import { IToken } from "../../../common/interfaces/token.interface";
import { CryptographerService } from "./cryptographer.service";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private cryptoService: CryptographerService,
        private readonly jwtService: JwtService
    ) {}

    public async validate(email): Promise<UserDAO> {
        return await this.usersService.findByEmail(email);
    }

    public async login(loginDTO: LoginDTO): Promise<IToken> {
        return this.validate(loginDTO.email).then(user => {
            const isValidPass = this.cryptoService.checkPassword(
                user.password,
                loginDTO.password
            );
            if (user && isValidPass) {
                const payload = {
                    nickname: user.nickname,
                    email: user.email,
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
            throw new HttpException(
                "Invalid credentials",
                HttpStatus.UNAUTHORIZED
            );
        });
    }

    public async register(registerDTO: RegisterDTO): Promise<any> {
        const user = await this.usersService.findByEmail(registerDTO.email);
        if (user) {
            throw new HttpException(
                "User is already exist",
                HttpStatus.BAD_REQUEST
            );
        }
        const candidateUser = {
            ...registerDTO,
            password: this.cryptoService.hashPassword(registerDTO.password)
        };
        await this.usersService.create(candidateUser);
        return {
            message: "User created"
        };
    }
}
