import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from "typeorm";
import * as crypto from "crypto";

@Entity()
export class UserDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column({ default: "" })
    nickname: string;

    @BeforeInsert()
    hashPassword(): void {
        this.password = crypto
            .createHmac("sha256", this.password)
            .digest("hex");
    }
    @Column()
    password: string;

    @Column({ default: "" })
    avatar_url: string;

    @Column({ default: 0 })
    balance: number;

    @Column({ default: false })
    is_dnd: boolean;
}
