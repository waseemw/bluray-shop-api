import {HttpException, HttpStatus, Injectable, OnApplicationBootstrap} from "@nestjs/common";
import {DataSource} from "typeorm";
import * as crypto from "crypto";
import {UserEntity} from "../user/user.entity";
import {hash} from "bcrypt";
import {BlurayEntity} from "../bluray/bluray.entity";

@Injectable()
export class AuthService implements OnApplicationBootstrap {
    private encryptionKey = "AB1E5AFA74A5C4157C5AC3EDA1AAD1BE1386F6C4063A5C6640A51293421AE4EE";
    userRepo = this.ds.getRepository(UserEntity);
    blurayRepo = this.ds.getRepository(BlurayEntity);

    constructor(private ds: DataSource) {
    }

    async resetBlurays() {
        await this.blurayRepo.save([
            {
                name: "The Batman",
                price: 60,
                stock: 30,
                imageUrl: "https://m.media-amazon.com/images/M/MV5BOGE2NWUwMDItMjA4Yi00N2Y3LWJjMzEtMDJjZTMzZTdlZGE5XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
                createdAt: new Date(Date.now()),
            },
            {
                name: "Batman Begins",
                price: 15,
                stock: 15,
                imageUrl: "https://m.media-amazon.com/images/M/MV5BOTY4YjI2N2MtYmFlMC00ZjcyLTg3YjEtMDQyM2ZjYzQ5YWFkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg",
                createdAt: new Date(Date.now() + 1000),
            },
            {
                name: "The Dark Knight",
                price: 20,
                stock: 25,
                imageUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
                createdAt: new Date(Date.now() + 2000),
            },
            {
                name: "The Dark Knight Rises",
                price: 10,
                stock: 12,
                imageUrl: "https://m.media-amazon.com/images/M/MV5BMTk4ODQzNDY3Ml5BMl5BanBnXkFtZTcwODA0NTM4Nw@@._V1_FMjpg_UX1000_.jpg",
                createdAt: new Date(Date.now() + 3000),
            },
        ]);
    }

    async onApplicationBootstrap() {
        if (await this.userRepo.count() == 0) {
            await this.userRepo.save({
                username: "admin",
                password: await hash("admin", 12),
                role: "ADMIN",
            });
            await this.resetBlurays();
        }
    }

    encrypt(obj: object) {
        const iv = crypto.randomBytes(32);
        const key = Buffer.from(this.encryptionKey, "hex");
        const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
        const encrypted = cipher.update(JSON.stringify(obj), "utf8", "hex");
        return (iv.toString("hex") + encrypted).toUpperCase();
    }

    decrypt(str: string) {
        const hex = Buffer.from(str, "hex");
        const key = Buffer.from(this.encryptionKey, "hex");
        const iv = hex.subarray(0, 32);
        const encrypted = hex.subarray(32);
        const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
        let decrypted: string;
        try {
            decrypted = decipher.update(encrypted, undefined, "utf8");
        } catch (e) {
            throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
        }
        return JSON.parse(decrypted);
    }
}