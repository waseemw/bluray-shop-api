import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class BlurayEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({unique: true})
    name: string;

    @Column({nullable: true})
    imageUrl?: string;

    @Column({type: "float"})
    price: number;

    @Column()
    stock: number;

    @CreateDateColumn()
    createdAt: Date;
}