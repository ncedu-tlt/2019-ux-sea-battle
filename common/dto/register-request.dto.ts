import { IsEmail, Length } from "class-validator";

export class RegisterRequestDTO {
    @IsEmail()
    email: string;

    @Length(3, 20)
    nickname: string;

    @Length(5, 20)
    password: string;
}
