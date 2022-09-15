import {Module} from "@nestjs/common";
import {UserController} from "./user/user.controller";
import {DataSource} from "typeorm";
import {datasource} from "./common/datasource";
import {BlurayController} from "./bluray/bluray.controller";
import {CartController} from "./cart/cart.controller";
import {AuthService} from "./common/auth.service";
import {APP_GUARD} from "@nestjs/core";
import {RoleGuard} from "./common/role.guard";

@Module({
    imports: [],
    controllers: [UserController, BlurayController, CartController],
    providers: [{provide: DataSource, useValue: datasource}, AuthService, {provide: APP_GUARD, useClass: RoleGuard}],
})
export class AppModule {
}
