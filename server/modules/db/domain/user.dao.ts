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
import { RoleDAO } from "./role.dao";
import { UserStatusDAO } from "./user-status.dao";
import { ShopItemDAO } from "./shop-item.dao";
import { AchievementDAO } from "./achievement.dao";

@Entity()
export class UserDAO {
    @PrimaryGeneratedColumn() id: number;

    @Column({ nullable: true })
    email: string;

    @Column({ unique: true, nullable: false })
    nickname: string;

    @Column({ nullable: true })
    password: string;

    @Column({ name: "avatar_url", nullable: true })
    avatarUrl: string;

    @ManyToOne(() => RoleDAO, {
        nullable: false,
        eager: true,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "role_id" })
    role: RoleDAO;

    @Column({ type: "float", default: 0 })
    balance: number;

    @Column({ type: "float", default: 0 })
    experience: number;

    @Column({ name: "is_anon", default: true }) isAnon: boolean;

    @Column({ name: "is_dnd", default: false }) isDnd: boolean;

    @OneToOne(() => UserStatusDAO, {
        nullable: true,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "status_id" })
    status: Promise<UserStatusDAO>;

    @ManyToMany(() => ShopItemDAO, {
        nullable: true,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinTable()
    @JoinColumn({ name: "bought_items" })
    boughtItems: Promise<ShopItemDAO[]>;

    @ManyToMany(() => AchievementDAO, {
        nullable: true,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinTable()
    achievements: Promise<AchievementDAO[]>;
}
