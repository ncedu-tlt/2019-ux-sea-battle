import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { PlayersModule } from "./modules/players/players.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { mainConfig } from "server/config/main.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";

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
        PlayersModule,
        AuthModule,
        UsersModule
    ]
})
export class AppModule {}
