import {CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, SetMetadata} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {AuthService} from "./auth.service";
import {UserToken} from "./user-token";
import {DataSource} from "typeorm";
import {UserEntity} from "../user/user.entity";

export const Role = (role: "ADMIN" | "CUSTOMER" | "OPEN") => SetMetadata("role", role);

@Injectable()
export class RoleGuard implements CanActivate {
    userRepo = this.ds.getRepository(UserEntity);

    constructor(private reflector: Reflector, private authService: AuthService, private ds: DataSource) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        let role = this.reflector.get<"ADMIN" | "CUSTOMER" | "OPEN">("role", context.getHandler());
        if (!role)
            role = this.reflector.get<"ADMIN" | "CUSTOMER" | "OPEN">("role", context.getClass());
        if (!role)
            role = "ADMIN";
        if (role == "OPEN")
            return true;
        const request = context.switchToHttp().getRequest();
        let authToken = request.headers.authorization;
        if (!authToken)
            throw new HttpException("You should be logged in for this action", HttpStatus.FORBIDDEN);
        authToken = authToken.substring("Bearer ".length);
        let userToken = this.authService.decrypt(authToken) as UserToken;
        let user = await this.userRepo.findOneBy({id: userToken.userId});
        if (!user)
            throw new HttpException("User with that token not found", HttpStatus.FORBIDDEN);
        request.user = user;
        if (user.role == "ADMIN")
            return true;
        else if (role == "CUSTOMER")
            return true;
        return false;
    }
}