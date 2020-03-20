/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserDAO } from "./user.dao";

@Entity()
export class RoleDao {
    constructor(id: number, role: string) {
        this._id = id;
        this._role = role;
    }

    @PrimaryGeneratedColumn()
    //Correct?
    @OneToMany(
        type => UserDAO,
        user => user.role
    )
    private _id: number;

    @Column({ type: "varchar", length: 255 }) private _role: string;

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get role(): string {
        return this._role;
    }

    set role(value: string) {
        this._role = value;
    }
}
