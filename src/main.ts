import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {datasource} from "./common/datasource";
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
    await datasource.initialize();
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        methods: "*",
        origin: "*",
    });
    app.useGlobalPipes(new ValidationPipe({whitelist: true, transform: true}));
    await app.listen(3000);
}

bootstrap();
