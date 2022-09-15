import {IsString, MaxLength, MinLength} from "class-validator";

export class CredentialsDto {
    @IsString()
    @MinLength(5)
    @MaxLength(24)
    username: string;

    @IsString()
    @MinLength(5)
    @MaxLength(24)
    password: string;
}