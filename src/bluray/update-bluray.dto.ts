import {IsInt, IsNumber, IsOptional, IsString, IsUrl, IsUUID, Min} from "class-validator";

export class UpdateBlurayDto {
    @IsUUID()
    id: string;

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsUrl()
    imageUrl?: string;

    @IsOptional()
    @IsNumber()
    price: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    stock: number;
}