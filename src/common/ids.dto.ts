import {ArrayNotEmpty, IsArray, IsUUID} from "class-validator";

export class IdsDto {
    @IsUUID(undefined, {each: true})
    @IsArray()
    @ArrayNotEmpty()
    ids: string[];
}