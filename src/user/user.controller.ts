import {Body, Controller, HttpException, HttpStatus, Post} from "@nestjs/common";
import {CredentialsDto} from "./credentials.dto";
import {DataSource} from "typeorm";
import {UserEntity} from "./user.entity";
import {compare, hash} from "bcrypt";
import {AuthService} from "../common/auth.service";
import {UserToken} from "../common/user-token";
import {Role} from "../common/role.guard";

@Role("OPEN")
@Controller("user")
export class UserController {
    userRepo = this.ds.getRepository(UserEntity);

    constructor(private ds: DataSource, private authService: AuthService) {
    }

    @Post()
    async register(@Body() credentialsDto: CredentialsDto) {
        let user = await this.userRepo.findOneBy({username: credentialsDto.username});
        if (user)
            throw new HttpException("A user with that username already exists", HttpStatus.CONFLICT);
        user = await this.userRepo.save({
            username: credentialsDto.username,
            password: await hash(credentialsDto.password, 12),
            role: "CUSTOMER",
        });
        return {authToken: this.authService.encrypt(new UserToken(user.id)), role: user.role};
    }

    @Post("login")
    async login(@Body() credentialsDto: CredentialsDto) {
        let user = await this.userRepo.findOneBy({username: credentialsDto.username});
        if (!user)
            throw new HttpException("A user with that username not found", HttpStatus.CONFLICT);
        if (!await compare(credentialsDto.password, user.password))
            throw new HttpException("Incorrect password", HttpStatus.FORBIDDEN);
        return {authToken: this.authService.encrypt(new UserToken(user.id)), role: user.role};
    }
}