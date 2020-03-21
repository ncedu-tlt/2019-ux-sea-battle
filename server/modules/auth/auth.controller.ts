import { Body, Controller, Post } from "@nestjs/common";
import { LoginDTO, RegisterDTO } from "../../../common/dto/auth.dto";
import { AuthService } from "./auth.service";
import { IToken } from "../../../common/interfaces/token.interface";

@Controller("/api/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/login")
    async login(@Body() loginDTO: LoginDTO): Promise<IToken> {
        return this.authService.login(loginDTO);
    }

    @Post("/register")
    async register(@Body() registerDTO: RegisterDTO): Promise<any> {
        return this.authService.register(registerDTO);
    }
}
