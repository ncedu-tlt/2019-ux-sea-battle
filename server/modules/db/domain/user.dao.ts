/* eslint-disable @typescript-eslint/camelcase,@typescript-eslint/no-unused-vars */
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { RoleDao } from "./role.dao";

@Entity()
export class UserDAO {
    constructor(
        email: string,
        nickname: string,
        password: string,
        avatar_url: string
    ) {
        this._email = email;
        this._nickname = nickname;
        this._password = password;
        this._avatar_url = avatar_url;
    }

    @PrimaryGeneratedColumn() private _id: number;

    @Column({ type: "varchar", length: 255, unique: true })
    private _email: string;

    @Column({ type: "varchar", length: 255 }) private _nickname: string;

    @Column({ type: "varchar", length: 255 }) private _password: string;

    @Column({ type: "varchar", length: 255 }) private _avatar_url: string;

    //Correct?
    @ManyToOne(type => RoleDao)
    @JoinColumn({ name: "role_id" })
    private _role: RoleDao;

    @Column({ type: "float" }) private _balance: number;

    @Column({ default: false }) private _is_dnd: boolean;

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get nickname(): string {
        return this._nickname;
    }

    set nickname(value: string) {
        this._nickname = value;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }

    get avatar_url(): string {
        return this._avatar_url;
    }

    set avatar_url(value: string) {
        this._avatar_url = value;
    }

    get role(): RoleDao {
        return this._role;
    }

    set role(value: RoleDao) {
        this._role = value;
    }

    get balance(): number {
        return this._balance;
    }

    set balance(value: number) {
        this._balance = value;
    }

    get is_dnd(): boolean {
        return this._is_dnd;
    }

    set is_dnd(value: boolean) {
        this._is_dnd = value;
    }
}
