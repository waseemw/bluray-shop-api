import {IsDateString, IsInt, IsNumber, IsOptional, IsString, IsUrl, IsUUID, Min} from "class-validator";

export class AddBlurayDto {
    @IsOptional()
    @IsUUID()
    id: string;

    @IsString()
    name: string;

    @IsOptional()
    @IsUrl()
    imageUrl?: string;

    @IsNumber()
    price: number;

    @IsInt()
    @Min(0)
    stock: number;
}