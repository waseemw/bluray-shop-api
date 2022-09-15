import {DataSource} from "typeorm";
import * as Path from "path";

export const datasource = new DataSource({
    database: "bluray",
    username: "postgres",
    password: "",
    type: "postgres",
    synchronize: true,
    entities: [Path.join(__dirname, "../**/*.entity{.ts,.js}")],
});