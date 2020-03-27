import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { RolesDao } from "./roles.dao";
import { UserStatusesDao } from "./userStatuses.dao";
import { ShopItemsDao } from "./shopItems.dao";
import { AchievementsDao } from "./achievements.dao";

@Entity()
export class UsersDao {
    @PrimaryGeneratedColumn() id: number;

    @Column({ nullable: true })
    email: string;

    @Column({ unique: true, nullable: false })
    nickname: string;

    @Column({ nullable: false })
    password: string;

    @Column({ name: "avatar_url", nullable: true })
    avatarUrl: string;

    @ManyToOne(() => RolesDao, { nullable: false, eager: true })
    @JoinColumn({ name: "role_id" })
    role: RolesDao;

    @Column({ type: "float", default: 0 })
    balance: number;

    @Column({ type: "float", default: 0 })
    experience: number;

    @Column({ name: "is_anon", default: true }) isAnon: boolean;

    @Column({ name: "is_dnd", default: false }) isDnd: boolean;

    @OneToOne(() => UserStatusesDao, { nullable: true })
    @JoinColumn({ name: "status_id" })
    status: Promise<UserStatusesDao>;

    @ManyToMany(() => ShopItemsDao, { nullable: true })
    @JoinTable()
    @JoinColumn({ name: "bought_items" })
    boughtItems: Promise<ShopItemsDao[]>;

    @ManyToMany(() => AchievementsDao, { nullable: true })
    @JoinTable()
    achievements: Promise<AchievementsDao[]>;
}
