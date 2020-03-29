import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserDAO } from "./domain/user.dao";
import { AchievementDAO } from "./domain/achievement.dao";
import { BanDAO } from "./domain/ban.dao";
import { FriendDAO } from "./domain/friend.dao";
import { GameModeDAO } from "./domain/game-mode.dao";
import { ParticipantDAO } from "./domain/participant.dao";
import { PostLikeDAO } from "./domain/post-like.dao";
import { PostDAO } from "./domain/post.dao";
import { ReportDAO } from "./domain/report.dao";
import { ReportStatusDAO } from "./domain/report-status.dao";
import { ShipPresetDAO } from "./domain/ship-preset.dao";
import { ShopCategoryDAO } from "./domain/shop-category.dao";
import { ShopItemDAO } from "./domain/shop-item.dao";
import { TagDAO } from "./domain/tag.dao";
import { GameDAO } from "./domain/game.dao";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserDAO,
            GameDAO,
            AchievementDAO,
            BanDAO,
            FriendDAO,
            GameModeDAO,
            ParticipantDAO,
            PostLikeDAO,
            PostDAO,
            ReportDAO,
            ReportStatusDAO,
            ShipPresetDAO,
            ShopCategoryDAO,
            ShopItemDAO,
            TagDAO
        ])
    ],
    exports: [TypeOrmModule]
})
export class DbModule {}
