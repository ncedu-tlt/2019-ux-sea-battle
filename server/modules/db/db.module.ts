import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserDAO } from "./domain/user.dao";
import { RoleDAO } from "./domain/role.dao";
import { AchievementDAO } from "./domain/achievement.dao";
import { BanDAO } from "./domain/ban.dao";
import { BanTypeDAO } from "./domain/banType";
import { FriendDAO } from "./domain/friend.dao";
import { FriendStatusDAO } from "./domain/friendStatus.dao";
import { GameModeDAO } from "./domain/gameMode.dao";
import { GameStatusDao } from "./domain/gameStatus.dao";
import { ParticipantDAO } from "./domain/participant.dao";
import { PostLikeDAO } from "./domain/postLike.dao";
import { PostDAO } from "./domain/post.dao";
import { ReportDAO } from "./domain/report.dao";
import { ReportStatusDao } from "./domain/reportStatus.dao";
import { ShipPresetDAO } from "./domain/shipPreset.dao";
import { ShopCategoryDAO } from "./domain/shopCategory.dao";
import { ShopItemDAO } from "./domain/shopItem.dao";
import { TagDAO } from "./domain/tag.dao";
import { UserStatusDao } from "./domain/userStatus.dao";
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
            GameStatusDao,
            ParticipantDAO,
            PostLikeDAO,
            PostDAO,
            ReportDAO,
            ReportStatusDao,
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
