import { CurrentUserDTO } from "./../../../common/dto/current-user.dto";
import { UpdateCurrentUserDto } from "common/dto/update-current-user.dto";
import {
    Get,
    Controller,
    Request,
    HttpException,
    HttpStatus,
    UseGuards,
    Patch,
    Body,
    UseInterceptors,
    UploadedFile
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "./users.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("/api/users")
export class UsersController {
    constructor(private userService: UsersService) {}

    @UseGuards(AuthGuard())
    @Get("/current")
    getCurrentUser(@Request() req): CurrentUserDTO {
        const user = req.user;
        if (!user) {
            throw new HttpException(
                "users/userDoesNotExist",
                HttpStatus.NOT_FOUND
            );
        }
        return {
            nickname: user.nickname,
            email: user.email,
            avatarUrl: user.avatarUrl,
            balance: user.balance,
            experience: user.experience,
            isAnon: user.isAnon,
            status: user.status
        };
    }

    @UseGuards(AuthGuard())
    @Patch()
    @UseInterceptors(FileInterceptor("image"))
    async update(
        @Request() req,
        @Body() body: UpdateCurrentUserDto,
        @UploadedFile() image
    ): Promise<CurrentUserDTO> {
        const user: UpdateCurrentUserDto = {
            ...body
        };
        user.id = req.user.id;

        const updatedUser = await this.userService.update(user, image);
        return {
            nickname: updatedUser.nickname,
            email: updatedUser.email,
            avatarUrl: updatedUser.avatarUrl,
            balance: updatedUser.balance,
            experience: updatedUser.experience,
            isAnon: updatedUser.isAnon,
            status: updatedUser.status
        };
    }
}
