import { Body, Controller, Post } from "@nestjs/common";
import { LoginRequestDTO } from "../../../common/dto/login-request.dto";
import { RegisterRequestDTO } from "../../../common/dto/register-request.dto";
import { AuthService } from "./auth.service";
import { LoginResponseDTO } from "../../../common/dto/login-response.dto";

@Controller("/api/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/login")
    async login(@Body() loginDTO: LoginRequestDTO): Promise<LoginResponseDTO> {
        return this.authService.login(loginDTO);
    }

    @Post("/register")
    async register(@Body() registerDTO: RegisterRequestDTO): Promise<any> {
        return this.authService.register(registerDTO);
    }
}
