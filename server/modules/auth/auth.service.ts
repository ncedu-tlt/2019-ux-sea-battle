import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as crypto from "crypto";
import { UserDTO } from "../../../common/dto/user.dto";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<boolean> {
        const user = await this.usersService.findByEmail(email);
        const hashedPassword = crypto
            .createHmac("sha256", password)
            .digest("hex");
        return user && user.password === hashedPassword;
    }

    login(user: UserDTO): any {
        const payload = { email: user.email, sub: user.id };
        return {
            // eslint-disable-next-line @typescript-eslint/camelcase
            access_token: this.jwtService.sign(payload)
        };
    }

    async register(user: UserDTO): Promise<any> {
        const isUserExist = await this.usersService.findByEmail(user.email);
        if (!isUserExist) {
            return await this.usersService.create(user);
        }
        throw new HttpException(
            "User is already exist",
            HttpStatus.BAD_REQUEST
        );
    }
}
