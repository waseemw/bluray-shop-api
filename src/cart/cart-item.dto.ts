import {IsNumber, IsString} from "class-validator";

export class CartItemDto {
    @IsString()
    blurayName: string;

    @IsNumber()
    count: number;
}