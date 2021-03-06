import { SharedModule } from "./modules/shared/shared.module";
import { PostsModule } from "./modules/posts/posts.module";
import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { mainConfig } from "server/config/main.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { MatchmakingModule } from "./modules/matchmaking/matchmaking.module";
import { GameModule } from "./modules/game/game.module";
import { WaitingForPlacementModule } from "./modules/waitng-for-placement/waiting-for-placement.module";

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
                autoLoadEntities: true,
                logging: false
            })
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "../../client"),
            exclude: ["/api/.*"]
        }),
        AuthModule,
        UsersModule,
        MatchmakingModule,
        GameModule,
        PostsModule,
        SharedModule,
        WaitingForPlacementModule
    ]
})
export class AppModule {}
