import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersDao } from "./domain/users.dao";
import { RolesDao } from "./domain/roles.dao";
import { AchievementsDao } from "./domain/achievements.dao";
import { BansDao } from "./domain/bans.dao";
import { BanTypes } from "./domain/banTypes";
import { FriendsDao } from "./domain/friends.dao";
import { FriendStatusesDao } from "./domain/friendStatuses.dao";
import { GameModesDao } from "./domain/gameModes.dao";
import { GameStatusesDao } from "./domain/gameStatuses.dao";
import { ParticipantsDao } from "./domain/participants.dao";
import { PostLikesDao } from "./domain/postLikes.dao";
import { PostsDao } from "./domain/posts.dao";
import { ReportsDao } from "./domain/reports.dao";
import { ReportStatusesDao } from "./domain/reportStatuses.dao";
import { ShipPresetsDao } from "./domain/shipPresets.dao";
import { ShopCategoriesDao } from "./domain/shopCategories.dao";
import { ShopItemsDao } from "./domain/shopItems.dao";
import { TagsDao } from "./domain/tags.dao";
import { UserStatusesDao } from "./domain/userStatuses.dao";
import { GamesDao } from "./domain/games.dao";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UsersDao,
            GamesDao,
            AchievementsDao,
            BansDao,
            BanTypes,
            FriendsDao,
            FriendStatusesDao,
            GameModesDao,
            GameStatusesDao,
            ParticipantsDao,
            PostLikesDao,
            PostsDao,
            ReportsDao,
            ReportStatusesDao,
            RolesDao,
            ShipPresetsDao,
            ShopCategoriesDao,
            ShopItemsDao,
            TagsDao,
            UserStatusesDao
        ])
    ],
    exports: [TypeOrmModule]
})
export class DbModule {}
