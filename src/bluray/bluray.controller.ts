import {Body, Controller, Delete, Get, Patch, Post, Query} from "@nestjs/common";
import {DataSource, In, MoreThan} from "typeorm";
import {BlurayEntity} from "./bluray.entity";
import {AddBlurayDto} from "./add-bluray.dto";
import {IdsDto} from "../common/ids.dto";
import {UpdateBlurayDto} from "./update-bluray.dto";
import {Role} from "../common/role.guard";
import {CartItemEntity} from "../cart/cart-item.entity";
import {AuthService} from "../common/auth.service";

@Role("ADMIN")
@Controller("bluray")
export class BlurayController {
    blurayRepo = this.ds.getRepository(BlurayEntity);
    cartRepo = this.ds.getRepository(CartItemEntity);

    constructor(private ds: DataSource, private authService: AuthService) {
    }

    @Role("OPEN")
    @Get()
    async getBlurays(@Query("page") pageStr: string, @Query("showAll") showAll = false) {
        let page = pageStr ? Number(pageStr) - 1 : 0;
        let [result, count] = await this.blurayRepo.findAndCount({
            take: 24,
            skip: 24 * page,
            order: {createdAt: "ASC"},
            where: showAll ? {} : {stock: MoreThan(0)},
        });
        return {count, result};
    }

    @Post()
    async saveBluray(@Body() addBlurayDto: AddBlurayDto) {
        return await this.blurayRepo.save(addBlurayDto);
    }

    @Delete()
    async deleteBlurays(@Body() idsDto: IdsDto) {
        await this.cartRepo.delete({bluray: {id: In(idsDto.ids)}});
        let res = await this.blurayRepo.delete(idsDto.ids);
        return {affected: res.affected};
    }

    @Patch()
    async updateBluray(@Body() updateBlurayDto: UpdateBlurayDto) {
        let res = await this.blurayRepo.update(updateBlurayDto.id, updateBlurayDto);
        return {affected: res.affected};
    }


    @Post("reset")
    async resetBlurays() {
        await this.cartRepo.delete({});
        await this.blurayRepo.delete({});
        await this.authService.resetBlurays();
    }
}