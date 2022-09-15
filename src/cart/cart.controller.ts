import {Body, Controller, Delete, Get, Post} from "@nestjs/common";
import {User} from "../common/user.decorator";
import {UserEntity} from "../user/user.entity";
import {DataSource} from "typeorm";
import {CartItemEntity} from "./cart-item.entity";
import {CartItemDto} from "./cart-item.dto";
import {Role} from "../common/role.guard";
import {BlurayEntity} from "../bluray/bluray.entity";

@Role("CUSTOMER")
@Controller("cart")
export class CartController {
    cartItemRepo = this.ds.getRepository(CartItemEntity);
    blurayRepo = this.ds.getRepository(BlurayEntity);

    constructor(private ds: DataSource) {
    }

    @Delete()
    async clearCart(@User() user: UserEntity) {
        let cartItems = await this.cartItemRepo.find({where: {user: {id: user.id}}, relations: ["bluray"]});
        for (let item of cartItems)
            await this.blurayRepo.update(item.bluray.id, {stock: Math.max(item.bluray.stock -= item.count, 0)});

        return await this.cartItemRepo.delete({user: {id: user.id}});
    }

    @Get()
    async getCart(@User() user: UserEntity) {
        return await this.cartItemRepo.find({where: {user: {id: user.id}}, relations: ["user", "bluray"]});
    }

    @Post()
    async setCartItem(@Body() cartItemDto: CartItemDto, @User() user: UserEntity) {
        let cartItem = await this.cartItemRepo.findOne({
            where: {
                bluray: {id: (await this.blurayRepo.findOneBy({name: cartItemDto.blurayName}))?.id},
                user: {id: user.id},
            },
            relations: ["user", "bluray"],
        });
        if (cartItem) {
            if (cartItemDto.count == 0) {
                let res = await this.cartItemRepo.delete(cartItem.id);
                return {affected: res.affected};
            } else {
                let res = await this.cartItemRepo.update(cartItem.id, {count: cartItemDto.count});
                return {affected: res.affected};
            }
        } else if (cartItemDto.count > 0) {
            await this.cartItemRepo.save({
                count: cartItemDto.count,
                user: {id: user.id},
                bluray: {id: (await this.blurayRepo.findOneBy({name: cartItemDto.blurayName}))?.id},
            });
            return {affected: 1};
        }
        return {affected: 0};
    }
}