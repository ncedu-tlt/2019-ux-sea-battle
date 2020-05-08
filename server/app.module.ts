import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { mainConfig } from "server/config/main.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { SearchForRivalsModule } from "./modules/search-for-rivals/search-for-rivals.module";
import { GameModule } from "./modules/game/game.module";

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
                url: configService.get<string>("dbUrl"),
                synchronize: true,
                autoLoadEntities: true
            })
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "../../client"),
            exclude: ["/api/.*"]
        }),
        AuthModule,
        UsersModule,
        SearchForRivalsModule,
        GameModule
    ]
})
export class AppModule {}
