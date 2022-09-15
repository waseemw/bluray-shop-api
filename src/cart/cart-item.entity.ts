import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../user/user.entity";
import {BlurayEntity} from "../bluray/bluray.entity";

@Entity()
export class CartItemEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    count: number;

    @ManyToOne(() => UserEntity)
    user: UserEntity;

    @ManyToOne(() => BlurayEntity)
    bluray: BlurayEntity;
}