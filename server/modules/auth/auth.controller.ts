import { Controller, UseGuards, Post, Request, Body } from "@nestjs/common";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { AuthService } from "./auth.service";
import { UserDTO } from "../../../common/dto/user.dto";

@Controller("/api/auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post("/login")
    login(@Request() req): any {
        return this.authService.login(req.user);
    }

    @Post("/register")
    async register(@Body() user: UserDTO): Promise<any> {
        return this.authService.register(user);
    }
}
