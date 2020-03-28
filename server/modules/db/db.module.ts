import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserDAO } from "./domain/user.dao";
import { RoleDAO } from "./domain/role.dao";
import { AchievementDAO } from "./domain/achievement.dao";
import { BanDAO } from "./domain/ban.dao";
import { BanTypeDAO } from "./domain/banType";
import { FriendsDAO } from "./domain/friends.dao";
import { FriendStatusDAO } from "./domain/friendStatus.dao";
import { GameModeDAO } from "./domain/gameMode.dao";
import { GameStatuseDAO } from "./domain/gameStatuse.dao";
import { ParticipantDAO } from "./domain/participant.dao";
import { PostLikeDAO } from "./domain/postLike.dao";
import { PostDAO } from "./domain/post.dao";
import { ReportDAO } from "./domain/report.dao";
import { ReportStatuseDAO } from "./domain/reportStatuse.dao";
import { ShipPresetDAO } from "./domain/shipPreset.dao";
import { ShopCategoryDAO } from "./domain/shopCategory.dao";
import { ShopItemDAO } from "./domain/shopItem.dao";
import { TagDAO } from "./domain/tag.dao";
import { UserStatuseDAO } from "./domain/userStatuse.dao";
import { GameDAO } from "./domain/game.dao";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserDAO,
            GameDAO,
            AchievementDAO,
            BanDAO,
            BanTypeDAO,
            FriendsDAO,
            FriendStatusDAO,
            GameModeDAO,
            GameStatuseDAO,
            ParticipantDAO,
            PostLikeDAO,
            PostDAO,
            ReportDAO,
            ReportStatuseDAO,
            RoleDAO,
            ShipPresetDAO,
            ShopCategoryDAO,
            ShopItemDAO,
            TagDAO,
            UserStatuseDAO
        ])
    ],
    exports: [TypeOrmModule]
})
export class DbModule {}
