import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserDAO } from "./domain/user.dao";
import { RoleDAO } from "./domain/role.dao";
import { AchievementDAO } from "./domain/achievement.dao";
import { BanDAO } from "./domain/ban.dao";
import { BanTypeDAO } from "./domain/ban-type";
import { FriendDAO } from "./domain/friend.dao";
import { FriendStatusDAO } from "./domain/friend-status.dao";
import { GameModeDAO } from "./domain/game-mode.dao";
import { GameStatusDAO } from "./domain/game-status.dao";
import { ParticipantDAO } from "./domain/participant.dao";
import { PostLikeDAO } from "./domain/post-like.dao";
import { PostDAO } from "./domain/post.dao";
import { ReportDAO } from "./domain/report.dao";
import { ReportStatusDAO } from "./domain/report-status.dao";
import { ShipPresetDAO } from "./domain/ship-preset.dao";
import { ShopCategoryDAO } from "./domain/shop-category.dao";
import { ShopItemDAO } from "./domain/shop-item.dao";
import { TagDAO } from "./domain/tag.dao";
import { UserStatusDao } from "./domain/user-status.dao";
import { GameDAO } from "./domain/game.dao";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserDAO,
            GameDAO,
            AchievementDAO,
            BanDAO,
            BanTypeDAO,
            FriendDAO,
            FriendStatusDAO,
            GameModeDAO,
            GameStatusDAO,
            ParticipantDAO,
            PostLikeDAO,
            PostDAO,
            ReportDAO,
            ReportStatusDAO,
            RoleDAO,
            ShipPresetDAO,
            ShopCategoryDAO,
            ShopItemDAO,
            TagDAO,
            UserStatusDao
        ])
    ],
    exports: [TypeOrmModule]
})
export class DbModule {}
