import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { UsersModule } from "./modules/users/users.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { mainConfig } from "server/config/main.config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [mainConfig]
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: "postgres",
                url: configService.get("dbUrl"),
                synchronize: true,
                autoLoadEntities: true
            })
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "../../client"),
            exclude: ["/api/.*"]
        }),
        UsersModule
    ]
})
export class AppModule {}
